import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UnsafeHtml } from 'src/app/domain/definitions/key-types';
import { ChangeRecoMode, LineNumberingMode } from 'src/app/domain/models/motions/motions.constants';
import { LineRange } from 'src/app/site/pages/meetings/pages/motions/definitions';
import { ViewUnifiedChange } from 'src/app/site/pages/meetings/pages/motions/modules/change-recommendations/view-models/view-unified-change';
import { MeetingComponentServiceCollectorService } from 'src/app/site/pages/meetings/services/meeting-component-service-collector.service';

import { DiffLinesInParagraph } from '../../../../definitions/index';
import { ParagraphToChoose } from '../../../../services/common/motion-line-numbering.service/motion-line-numbering.service';
import { BaseMotionDetailChildComponent } from '../../base/base-motion-detail-child.component';
import { MotionDetailServiceCollectorService } from '../../services/motion-detail-service-collector.service/motion-detail-service-collector.service';

interface ParagraphBasedAmendmentContent {
    amendment_paragraphs: { [paragraph_number: number]: any };
    selected_paragraphs: ParagraphToChoose[];
    broken_paragraphs: string[];
}

const CONTENT_FORM_SUBSCRIPTION_NAME = `contentForm`;

@Component({
    selector: `os-paragraph-based-amendment`,
    templateUrl: `./paragraph-based-amendment.component.html`,
    styleUrls: [`./paragraph-based-amendment.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ParagraphBasedAmendmentComponent extends BaseMotionDetailChildComponent {
    public readonly LineNumberingMode = LineNumberingMode;
    public readonly ChangeRecoMode = ChangeRecoMode;

    @Input()
    public changesForDiffMode: ViewUnifiedChange[] = [];

    @Input()
    public highlightedLine!: number;

    @Input()
    public isFinalEdit = false;

    @Output()
    public createChangeRecommendation = new EventEmitter<LineRange>();

    @Output()
    public formChanged = new EventEmitter<any>();

    @Output()
    public validStateChanged = new EventEmitter<boolean>();

    public showAmendmentContext = false;

    public selectedParagraphs: ParagraphToChoose[] = [];

    public brokenParagraphs: string[] = [];

    public contentForm: UntypedFormGroup | null = null;

    public amendmentErrorMessage: string | null = null;

    public get amendmentLines(): DiffLinesInParagraph[] | null {
        return this.motion?.changedAmendmentLines;
    }

    public get nativeElement(): any {
        return this.el.nativeElement;
    }

    public constructor(
        componentServiceCollector: MeetingComponentServiceCollectorService,
        protected override translate: TranslateService,
        motionServiceCollector: MotionDetailServiceCollectorService,
        private fb: UntypedFormBuilder,
        private cd: ChangeDetectorRef,
        private el: ElementRef
    ) {
        super(componentServiceCollector, translate, motionServiceCollector);
    }

    /**
     * This returns the plain HTML of a changed area in an amendment, including its context,
     * for the purpose of piping it into <motion-detail-original-change-recommendations>.
     * This component works with plain HTML, hence we are composing plain HTML here, too.
     *
     * @param {DiffLinesInParagraph} paragraph
     * @returns {string}
     *
     * TODO: Seems to be directly duplicated in the slide
     */
    public getAmendmentDiffTextWithContext(paragraph: DiffLinesInParagraph): UnsafeHtml {
        return (
            `<div class="paragraphcontext">${paragraph.textPre}</div>` +
            `<div>${paragraph.text}</div>` +
            `<div class="paragraphcontext">${paragraph.textPost}</div>`
        );
    }

    /**
     * If `this.motion` is an amendment, this returns the list of all changed paragraphs.
     *
     * @returns {DiffLinesInParagraph[]}
     */
    public getAmendmentParagraphs(): DiffLinesInParagraph[] {
        try {
            this.amendmentErrorMessage = null;
            return this.motion?.getAmendmentParagraphLines(this.changeRecoMode, this.showAmendmentContext) || [];
        } catch (e: any) {
            this.amendmentErrorMessage = e.toString();
            return [];
        }
    }

    public getAmendmentParagraphLinesTitle(paragraph: DiffLinesInParagraph): string {
        return this.motion?.getParagraphTitleByParagraph(paragraph) || ``;
    }

    public isControlInvalid(paragraphNumber: number): boolean {
        const control = this.contentForm!.get(paragraphNumber.toString())!;
        return control.invalid && (control.dirty || control.touched);
    }

    protected override onEnterEditMode(): void {
        if (this.contentForm) {
            this.contentForm = null;
        }
        const contentPatch = this.createForm();
        this.contentForm = this.fb.group(contentPatch.amendment_paragraphs);
        this.selectedParagraphs = contentPatch.selected_paragraphs;
        this.brokenParagraphs = contentPatch.broken_paragraphs;
        this.propagateChanges();
    }

    private createForm(): ParagraphBasedAmendmentContent {
        const contentPatch: ParagraphBasedAmendmentContent = {
            selected_paragraphs: [],
            amendment_paragraphs: {},
            broken_paragraphs: []
        };
        const leadMotion = this.motion.lead_motion;
        // Hint: lineLength is sometimes not loaded yet when this form is initialized;
        // This doesn't hurt as long as patchForm is called when editing mode is started, i.e., later.
        if (leadMotion && this.lineLength) {
            const paragraphsToChoose = this.motionLineNumbering.getParagraphsToChoose(leadMotion, this.lineLength);

            paragraphsToChoose.forEach((paragraph: ParagraphToChoose, paragraphNo: number): void => {
                const amendmentParagraph = this.motion.amendment_paragraph_text(paragraphNo);
                if (amendmentParagraph !== null && amendmentParagraph !== undefined) {
                    contentPatch.selected_paragraphs.push(paragraph);
                    contentPatch.amendment_paragraphs[paragraphNo] = [amendmentParagraph];
                }
            });
            // If the motion has been shortened after the amendment has been created, we will show the paragraphs
            // of the amendment as read-only
            for (
                let paragraphNo = paragraphsToChoose.length;
                paragraphNo < this.motion.amendment_paragraph_numbers.length;
                paragraphNo++
            ) {
                if (this.motion.amendment_paragraph_text(paragraphNo) !== null) {
                    contentPatch.broken_paragraphs.push(this.motion.amendment_paragraph_text(paragraphNo)!);
                }
            }
        }
        return contentPatch;
    }

    private propagateChanges(): void {
        this.updateSubscription(
            CONTENT_FORM_SUBSCRIPTION_NAME,
            this.contentForm!.valueChanges.subscribe(value => {
                if (value) {
                    this.formChanged.emit({ amendment_paragraphs: value });
                    this.validStateChanged.emit(this.contentForm!.valid);
                    this.cd.markForCheck();
                }
            })
        );
    }
}

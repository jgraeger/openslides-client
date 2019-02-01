import { Injectable } from '@angular/core';
import { Searchable } from '../../site/base/searchable';
import { BaseViewModel } from 'app/site/base/base-view-model';

/**
 * The representation every searchable model should use to represent their data.
 */
export type SearchRepresentation = string[];

/**
 * Our representation of a searchable model for external use.
 */
export interface SearchModel {
    /**
     * The collection string.
     */
    collectionString: string;

    /**
     * The singular verbose name of the model.
     */
    verboseNameSingular: string;

    /**
     * The plural verbose name of the model.
     */
    verboseNamePlural: string;
}

/**
 * A search result has the model's collectionstring, a verbose name and the actual models.
 */
export interface SearchResult {
    /**
     * The collection string.
     */
    collectionString: string;

    /**
     * This verbodeName must have the right cardianlity. If there is exactly one model in `models`,
     * it should have a singular value, else a plural name.
     */
    verboseName: string;

    /**
     * All matched models.
     */
    models: (BaseViewModel & Searchable)[];
}

/**
 * This service cares about searching the DataStore and managing models, that are searchable.
 */
@Injectable({
    providedIn: 'root'
})
export class SearchService {
    /**
     * All searchable models in our own representation.
     */
    private searchModels: {
        collectionString: string;
        verboseNameSingular: string;
        verboseNamePlural: string;
        displayOrder: number;
    }[] = [];

    /**
     * @param DS The DataStore to search in.
     */
    public constructor() {}

    /**
     * Registers a model by the given attributes.
     *
     * @param collectionString The colelction string of the model
     * @param ctor The model constructor
     * @param displayOrder The order in which the elements should be displayed.
     */
    public registerModel(
        collectionString: string,
        ctor: new (...args: any[]) => Searchable & BaseViewModel,
        displayOrder: number
    ): void {
        const instance = new ctor();
        this.searchModels.push({
            collectionString: collectionString,
            verboseNameSingular: instance.getVerboseName(),
            verboseNamePlural: instance.getVerboseName(true),
            displayOrder: displayOrder
        });
        this.searchModels.sort((a, b) => a.displayOrder - b.displayOrder);
    }

    /**
     * @returns all registered models for the UI.
     */
    public getRegisteredModels(): SearchModel[] {
        return this.searchModels.map(searchModel => ({
            collectionString: searchModel.collectionString,
            verboseNameSingular: searchModel.verboseNameSingular,
            verboseNamePlural: searchModel.verboseNamePlural
        }));
    }

    /**
     * Does the actual searching.
     *
     * @param query The search query
     * @param inCollectionStrings All connection strings which should be used for searching.
     * @returns All search results.
     */
    public search(query: string, inCollectionStrings: string[]): SearchResult[] {
        query = query.toLowerCase();
        /*return this.searchModels
            .filter(s => inCollectionStrings.includes(s.collectionString))
            .map(searchModel => {
                const results = this.viewModelStore.filter(searchModel.collectionString, model =>
                    model.formatForSearch().some(text => text.toLowerCase().includes(query))
                );
                return {
                    collectionString: searchModel.collectionString,
                    verboseName: results.length === 1 ? searchModel.verboseNameSingular : searchModel.verboseNamePlural,
                    models: results
                };
            });*/
        throw new Error('Todo');
        return [];
    }
}

import { Injectable } from '@angular/core';
import { CollectionStringMapperService } from './collectionStringMapper.service';
import { BaseViewModel, ViewModelConstructor } from 'app/site/base/base-view-model';
import { BaseRepository } from '../repositories/base-repository';

/**
 * This service takes care of handling view models.
 */
@Injectable({
    providedIn: 'root'
})
export class ViewModelStoreService {
    /**
     * @param mapperService
     */
    public constructor(private mapperService: CollectionStringMapperService) {}

    /**
     * gets the repository from a collection string or a view model constructor.
     *
     * @param collectionType The collection string or constructor.
     */
    private getRepository<T extends BaseViewModel>(
        collectionType: ViewModelConstructor<T> | string
    ): BaseRepository<T, any> {
        if (typeof collectionType === 'string') {
            return this.mapperService.getRepositoryFromCollectionString(collectionType) as BaseRepository<T, any>;
        } else {
            return this.mapperService.getRepositoryFromViewModelConstructor(collectionType as ViewModelConstructor<T>);
        }
    }

    /**
     * Returns the view model identified by the collectionString and id
     *
     * @param collectionString The collection of the view model
     * @param id The id of the view model
     */
    public get<T extends BaseViewModel>(collectionType: ViewModelConstructor<T> | string, id: number): T {
        return this.getRepository(collectionType).getViewModel(id);
    }

    /**
     * Returns all view models for the given ids.
     *
     * @param collectionType The collection of the view model
     * @param ids All ids to match
     */
    public getMany<T extends BaseViewModel>(collectionType: ViewModelConstructor<T> | string, ids: number[]): T[] {
        const repository = this.getRepository<T>(collectionType);

        return ids
            .map(id => {
                return repository.getViewModel(id);
            })
            .filter(model => !!model); // remove non valid models.
    }

    /**
     * Gets all view models from a collection
     *
     * @param collectionString  The collection
     * @returns all models from the collection
     */
    public getAll<T extends BaseViewModel>(collectionType: ViewModelConstructor<T> | string): T[] {
        return this.getRepository(collectionType).getViewModelList();
    }

    /**
     * Get all view modles from a collection, that satisfy the callback
     *
     * @param collectionString The collection
     * @param callback The function to check
     * @returns all matched view models of the collection
     */
    public filter<T extends BaseViewModel>(collectionString: string, callback: (model: T) => boolean): T[] {
        return this.getAll<T>(collectionString).filter(callback);
    }

    /**
     * Finds one view model from the collection, that satifies the callback
     *
     * @param collectionString The collection
     * @param callback THe callback to satisfy
     * @returns a found view model or null, if nothing was found.
     */
    public find<T extends BaseViewModel>(collectionString: string, callback: (model: T) => boolean): T {
        return this.getAll<T>(collectionString).find(callback);
    }
}

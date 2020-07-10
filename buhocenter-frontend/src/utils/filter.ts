export class Filter {
    private readonly _filter: string;

    constructor(filter: { [key: string]: any }) {
        this._filter = '';
        for (const i in filter) {
            if (filter[i] !== undefined) {
                this._filter += i + '=' + filter[i] + '&';
            }
        }
        if (this._filter.length) this._filter = this._filter.substring(0, this._filter.length - 1);
    }

    get() {
        return this._filter;
    }
}

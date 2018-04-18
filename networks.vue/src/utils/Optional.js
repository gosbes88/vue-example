export class Optional {
    constructor(el = null) {
        this.el = el;
    }

    isPresent() {
        return this.el !== null && this.el !== undefined && !Number.isNaN(this.el);
    }

    get() {
        return this.el;
    }

    orElse(val) {
        return this.isPresent() ? this.el : val;
    }

    static create(val) {
        return new Optional(val);
    }

    static empty() {
        return new Optional();
    }
}

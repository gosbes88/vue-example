export class SurveyEquals {
    constructor (serverData = null, storageData = null) {
        this._serverData = serverData;
        this._storageData = storageData;
        this._recalcRelationshipTypeWeights = false;
    }
    static create(serverData = null, storageData = null) {
        return new SurveyEquals(serverData, storageData);
    }
    static isEmptyObject(obj) {
        if (typeof obj !== "object" || Object.keys(obj).length === 0) {
            return true;
        }
        for (let key in obj) {
            if (obj[key]) {
                return false;
            }
        }
        return true;
    }
    getExists() {
        if (!SurveyEquals.isEmptyObject(this.serverData)) {
            return this.serverData;
        }
        if (!SurveyEquals.isEmptyObject(this.storageData)) {
            return this.storageData;
        }
        return {};
    }
    equals() {
        return this._isExists() ? this.serverData.id === this.storageData.id : false;
    }
    merge() {
        return !this.equals ? this.getExists() : this._merge();
    }
    _checkRelationshipTypeWeights(relationshipTypeWeights1, relationshipTypeWeights2) {
        if (relationshipTypeWeights1.length !== relationshipTypeWeights2.length) {
            this.recalcRelationshipTypeWeights = true;
        }

        relationshipTypeWeights1.some(e => {
            const notEquals = relationshipTypeWeights2.some(e2 => {
                if (e.id !== e2.id) {
                    return false;
                }
                return e.weight !== e2.weight;
            });
            if (notEquals) {
                this.recalcRelationshipTypeWeights = true;
            }
            return notEquals;
        }, this);
    }
    _merge() {
        let server = this.serverData;
        const storage = this.storageData;
        if (server.name !== storage.name) {
            server.name = storage.name;
        }

        this._checkRelationshipTypeWeights(server.relationshipTypeWeights, storage.relationshipTypeWeights);

        storage.questions.forEach(question => {
            let existsQuestion = server.questions.some(serverQuestion => {
                if (serverQuestion.id !== question.id) {
                    return false;
                }

                serverQuestion.text = question.text;
                if (question.isAdded) {
                    serverQuestion.isAdded = true;
                }
                this._checkRelationshipTypeWeights(serverQuestion.questionRelationshipTypes, question.questionRelationshipTypes);
                return true;
            }, this);
            if (!existsQuestion) {
                server.questions.push(question);
                this.recalcRelationshipTypeWeights = true;
            }
        }, this);

        return server;
    }
    _isExists() {
        return Boolean(this._serverData) && Boolean(this._storageData);
    }
    get recalcRelationshipTypeWeights() {
        return this._recalcRelationshipTypeWeights;
    }
    set recalcRelationshipTypeWeights(val) {
        if (typeof val === 'boolean') {
            this._recalcRelationshipTypeWeights = val;
        } else {
            console.error('incorrect argument "val" to function "set" for recalcRelationshipTypeWeights');
        }
    }
    get serverData() {
        return this._serverData ? this._serverData : {};
    }
    set serverData(val) {
        if (!!val && typeof val === 'object') {
            this._serverData = val;
        } else {
            console.error('undefined argument "val" to function "set" for serverData');
        }
    }
    get storageData() {
        return this._storageData ? this._storageData : {};
    }
    set storageData(val) {
        if (!!val && typeof val === 'object') {
            this._storageData = val;
        } else {
            console.error('undefined argument "val" to function "set" for storageData');
        }
    }
}
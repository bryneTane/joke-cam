class Store{
    
    defs = []; people = [];

    setDefs = storeJson => {
        this.defs = storeJson;
        // console.log(this.defs)
    }
    getDefs = () => {
        // console.log(this.defs);
        return this.defs;
    }
    setPeople = users => {
        let result = [];
        users.forEach(elt => {
            result[elt.id] = elt;
        });
        this.people = result;
    } 

    getPeople = () => this.people;
}

export default new Store();
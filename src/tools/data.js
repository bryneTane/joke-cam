class Store{
    
    defs = [];

    setDefs = storeJson => {
        this.defs = storeJson;
        // console.log(this.defs)
    }
    getDefs = () => {
        // console.log(this.defs);
        return this.defs;
    }
}

export default new Store();
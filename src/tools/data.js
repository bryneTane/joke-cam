class Store {

    defs = []; people = [];
    server = 'https://joke-cam.friedrich-tane.tech/server';

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

    addPerson = (person) => {
        if (this.people[person.id]) console.log("this person already exists");
        else this.people[person.id] = person;
    }

    setPP = (id, pp) => {
        if (!this.people[id]) console.log("this person does not exist");
        else this.people[id].pp = pp;
    }
}

export default new Store();
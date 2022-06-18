const pg = require('pg');


class Repository {
  constructor (config) {
    this.config = config.database;
    this.client = new pg.Client(this.config);
  }

  async query({queryString}) {
    return this.client.query(queryString).then(res => res).catch(e => console.error(e.stack))
  }

}

module.exports = Repository

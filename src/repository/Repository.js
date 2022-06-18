const pg = require('pg');


class Repository {
  constructor (config) {
    this.config = config;
    this.client = new pg.Client(this.config);
    this.client.connect(err => {
      if (err) throw err;
      else {
        console.log('DB Repository is connected')
      }
    });
  }

  async query(queryString) {
    console.log(queryString)
    return await this.client.query(queryString)
  }

}

module.exports = Repository

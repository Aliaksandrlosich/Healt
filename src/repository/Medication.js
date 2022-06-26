const Repository = require('./Repository')

class MedicationRepository extends Repository {
 constructor (config) {
  super(config)
 }

 async addMedicationToList ({ name, description, initCount, destinationCount, userId }) {
  const newMedication = await this.query(`INSERT INTO medication (name, description, initial_count, destination_count, user_id) 
    VALUES ('${name}', '${description}', ${initCount}, ${destinationCount}, '${userId}') RETURNING id;`)

  return newMedication.rows[0]
 }

 viewMedicationList () {

 }

 incrementMedicationCount () {

 }

 decrementMedicationCount () {

 }

 viewMedicationDetails () {

 }

 deleteMedication () {

 }

}

module.exports = MedicationRepository

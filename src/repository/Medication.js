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

 async getMedicationsList ({ userId }) {
  const medicationsList = await this.query(`SELECT name, description, initial_count as initCount, 
        destination_count as destinationCount, id FROM medication WHERE user_id='${userId}';`)

  return medicationsList.rows

 }

 async updateMedication({ medicationId, name, description, initCount, destinationCount }) {
  const medication = await this.query(`UPDATE medication
            SET name = '${name}', description = '${description}', initial_count = ${initCount}, destination_count = ${destinationCount}
            WHERE id = ${medicationId} RETURNING id;`)

  return medication.rows[0]
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

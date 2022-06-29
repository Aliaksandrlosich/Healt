const Domain = require('../Domain')

class Medications extends Domain {
 constructor (repository) {
  super(repository)
 }

 async addMedicationToList ({ name, description, initCount = 0, destinationCount = 0, userId }) {
  const medication = await this.repository.medication.addMedicationToList({
   name, description, initCount, destinationCount, userId
  })

  return { statusCode: 200, medicationId: medication.id, message: 'SUCCESS' }
 }

 async getMedicationsList ({ userId }) {
  const medicationsList = await this.repository.medication.getMedicationsList({ userId })

  return { statusCode: 200, message: 'SUCCESS', medications: medicationsList }
 }

 async updateMedication ({ medicationId, name, description, initCount, destinationCount }) {
  const medication = await this.repository.medication.updateMedication({
   medicationId,
   name,
   description,
   initCount,
   destinationCount
  })
  if (medication) {
   return { statusCode: 200, message: 'SUCCESS' }
  } else {
   return { statusCode: 400, error: 'UNKNOWN_ID' }
  }

 }

 incrementMedicationCount () {

 }

 decrementMedicationCount () {

 }

 getMedicationDetails () {

 }

 async deleteMedication ({ medicationId }) {
  const result = await this.repository.medication.deleteMedication({ medicationId })

  return { statusCode: 200, message: 'SUCCESS' }
 }
}

module.exports = Medications

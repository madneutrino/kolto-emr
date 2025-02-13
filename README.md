<h1 align="center">Elyx EMR</h1>
<p align="center">A scaffolding to build an EMR for Elyx, based on the Medplum. We use the charting example as a base, with aspects of foomedical example added in</p>
<p align="center">
<a href="https://github.com/medplum/medplum-hello-world/blob/main/LICENSE.txt">
    <img src="https://img.shields.io/badge/license-Apache-blue.svg" />
  </a>
</p>

- Using [Medplum React Components](https://storybook.medplum.com/?path=/docs/medplum-introduction--docs) to display a chart that provides visibility on a patient
  - More information on a [charting experience](https://www.medplum.com/docs/charting)
- Using [Medplum GraphQL](https://graphiql.medplum.com/) queries to fetch linked resources

### Components of the Patient Chart

The Patient Chart has 3 distinct panels

1. Clinical Chart
   The left panel shows the patient history and their status. Notable information in the clinical chart includes the following Resources:

   - Patient Information
   - Upcoming Appointments
   - Documented Visits
   - List of Allergies
   - List of Problems
   - Medication Requests
   - Smoking Status
   - Vitals

2. Tasks
   The center panel shows list of the Task resource with a different focus resource. See our [Tasks Guide](https://www.medplum.com/docs/careplans/tasks) for more details.

   - Each focus is interactive to either review or fill out
   - This example project demonstrates interactions of the following resources:
     - Questionnaire
     - QuestionnaireResponse
     - DiagnosticReport
     - CarePlan

3. SOAP Note
   The right most panel documents an enounter with the patient through a questionnaire. Filling out and submitting the questionnaire automatically creates a task, with the response as the focus to be reviewed.

4. Health Record
   Graphs of patients health metrics.

### Getting Started

This project will default to the medplum hosted backend. You need to create an account there for it to work.

Otherwise, you can clone the [medplum repo] (https://github.com/medplum/medplum) and setup your own copy of the server and backend.

[Fork](https://github.com/medplum/medplum-hello-world/fork) and clone the repo.

Next, install the dependencies.

```bash
npm install
```

Then, run the app

```bash
npm run dev
```

This app should run on `http://localhost:3000/`

### About Medplum

[Medplum](https://www.medplum.com/) is an open-source, API-first EHR. Medplum makes it easy to build healthcare apps quickly with less code.

- Read our [documentation](https://www.medplum.com/docs)

### Deploying to GCP

APP_BUCKET=medplum-app-elyx-emr ./deploy-app-gcp.sh

##TODO

- Medplum cli doesnt work, because we havent added the oauth endpoints in the frontend. We can use the admin app to complete the oauth loop.
-
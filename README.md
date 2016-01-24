# 2016-MIT-IAP-PrototypeJam UnWorkshop
An Online Participatory Tool for the 2016 IAP PrototypeJam

## What is this?
  **For Mass Participatory Ideation, Prioritization & Decision Making**

A tool/framework to help you gather, filter, choose and decide what to work on from the vast set of the ideas.

### The initial use case explained:
Goal: Deciding on what has to be built in the spring semester at law.MIT

## ROUND ONE: WHAT
**Ask: What do you want to be hacking?**
  - pitch in *ideas*, with a **title**, a **blurb** and **success metrics** via a web form.
  - submissions/references to submissions are *stored* in the contract along with the senders id/address.
  - **Rate** the submissions
  - authorized person *takes a call/decides* (the filter) - The selected idea is now a *candidate for the next round*
Output: The project summary as a README in the GitHub repo

## ROUND TWO: HOW
**Ask: How do we hack it?**
  - **Rate** the submissions
  - authorized person **takes a call**
Output: The Process. Details go into the README on GitHub

## ROUND THREE: WHEN
  - Ask *What key milestones* and *Dates* should we use.
  - Automate the results to Milestones in GitHub
  - Tie the "Successfully Achieved Success Metric" Issue to the Output

### MVP - 1 - features
  - API to **register** participants
  - API to **gather** WHATs - ideas{title, blurb}, success metrics[] in round 1 and HOWs - language, framework etc in round 2
  - API to **rate** the entries that were gathered (ideas are distributed to the participants randomly) #TODO @dazzaji, more details?
  - API to **sort** the entries based on the ratings
  - API to **filter**, in this case access is granted only to the authorized person for the respective round
  - **Decision** API that returns the final summary of the decisions made.

Note: This will evolve :)

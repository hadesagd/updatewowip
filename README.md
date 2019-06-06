# Update WIP on Device Magic

This script collects the Work In Process information from DBS and passes it on to Device Magic

## Libraries
The following libraries are used in this project:
- Axios: Provides communications with the DeviceMagic API
- Node-Jt400: Provides a wrapper for the JT400 and connectivity to DBS
- XLSX: To write an excel binary that gets pushed to the Device Magic Resources

## Description
This script connect to DBS to pull the following fields from the work in process:
- Work Order Number
- WO Segment
- Customer Number
- Customer Name
- Equipment Manufacturer
- Equipment Serial Number

This information is written to an Excel file, which is the format that Device Magic accepts.  After the file is written, the file is pushed to the sytem through the Resources API. A Windows Scheduled task runs this script to update the information every 10 minutes.

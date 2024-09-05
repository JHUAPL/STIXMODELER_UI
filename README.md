# STIX 2.1 Drag and Drop Modeler

This is a fork of the [STIX Modeler](https://github.com/STIX-Modeler/UI/tree/develop), originally created by Jason Minnick

## Overview
A React-based user interface tool for visualizing, creating, and modifying STIX 2.1 bundles

## New Features
- Define custom STIX Domain Objects (SDO) using schemas
- Define custom STIX Relationship Objects (SRO)
- Import STIX bundles and schemas using File Picker
- Create STIX Group objects by selecting SDOs
- Visualize STIX bundles with many relationships between SDOs

# Dependencies

This modeler was developed in and optimized for use with node v20.11.1 and npm 10.2.4

Earlier versions of node may not be supported

# Installation and Use 

- Install required node dependencies: `npm install`
- Build: `npm run build`
- Run: `npm run preview`

## Usage Notes
- In order to model bundles with custom SDOs, the user MUST import the schemas using the "Import" button prior to importing the bundle. Otherwise, custom SDOs will not be displayed.

# Development Notes
## Modifications

- Migrated project framework from Webpack to Vite to reduce unnecessary and duplicate dependencies (2.31GB->189MB)
- Replaced node and edge visualization with [React Flow](https://reactflow.dev/), an MIT-licensed open source library for creating and visualizing diagrams.
- Added a panel for pasting and importing custom SDO extensions from schema JSON
- Added panels for selecting and modifying SDO extension fields (currently only icon image)
- Added panel for importing schemas and bundles from JSON files
- Implemented drag-and-drop functionality for SDO extension objects
- Added functionality for defining new relationships between SDO objects (including extension)
- Added functionality for creating new Group SDOs via clicking and selecting SDOs
- Updated dependencies and removed unused dependencies
- Upgraded handling of default field and relationship values

## Bug Fixes

- Fixed issues preventing users from pasting in "incomplete" STIX bundles (i.e. bundles where objects are missing optional fields)
- Fixed unexpected modification of timestamps in Details panel
- Fixed implied fields based on relationships between nodes (e.g. "created_by")
- Fixed import and modification of nodes with "hashes" fields
- Added ability to delete external_reference objects from external_references fields

## Definitions

The definitions are a direct copy from the OASIS schemas repository without mutation. Right now these are statically shimmed in. I could see a backend process regularly pulling these into the project.

Reference: https://github.com/oasis-open/cti-stix2-json-schemas/tree/master/schemas/

## Definition Adapters

The definition adapters are a way to mutate the definitions to help control the flow of the visualization. All adapters inherit the Base.js adapter where much of the initial mutating happens.

## Control Property

The control property can be used to help extend custom options to display and/or interact with the properties in the details panel. Some properties default based on their type but if more complex or unique controls are required, the control property is the way to extend functionality.

Current controls:
- hidden: Hides the property in the details panel.
- literal: Outputs values as is with a control or input to edit.
- slider: Custom slider-bar control.
- csv: The csv control will take a comma separated list of values in a text control and split them into an array for the object property values.

    Example: foo,bar will mutate to ["foo", "bar"]

- killchain: Used to select complex arrays.
- externalrefs: Used to build complex objects.
- stringselector: Works like the array selector but only allows for selecting a single value to populate a string.
- textarea: Allows for cleaner input of larger text amounts.

## Hoisting Vocabs

In the definitions specific to an object, I hoist the vocabs onto the property it belongs to. This makes it seamless to pass along to the array control used to select options.

Specific vocab notes

- labels: there are placeholder values located in definition-adapters/Base.js. This can easily be updated to reflect your sharing group or company's standard list for each object or even hidden with the `control` property.

# Quality Assurance
## Style Guide
The source code follows a modification of the [Airbnb Javascript Style Guide](https://airbnb.io/javascript/react/)
## Automated Tools
The project uses eslint for quality assurance and styling.
- See current code quality issues: `npm run lint`
- See and fix code quality issues: `npm run lint:fix`

# DISCLAIMER

This code developed by JHU/APL is for demonstration and research purposes. It is not “turn key” and is not safe for deployment without being tailored to production infrastructure. These files are not being delivered as software and are not appropriate for direct use on any production networks. JHU/APL assumes no liability for the direct use of these files and they are provided strictly as a reference implementation.

NO WARRANTY, NO LIABILITY. THIS MATERIAL IS PROVIDED “AS IS.” JHU/APL MAKES NO REPRESENTATION OR WARRANTY WITH RESPECT TO THE PERFORMANCE OF THE MATERIALS, INCLUDING THEIR SAFETY, EFFECTIVENESS, OR COMMERCIAL VIABILITY, AND DISCLAIMS ALL WARRANTIES IN THE MATERIAL, WHETHER EXPRESS OR IMPLIED, INCLUDING (BUT NOT LIMITED TO) ANY AND ALL IMPLIED WARRANTIES OF PERFORMANCE, MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT OF INTELLECTUAL PROPERTY OR OTHER THIRD PARTY RIGHTS. ANY USER OF THE MATERIAL ASSUMES THE ENTIRE RISK AND LIABILITY FOR USING THE MATERIAL. IN NO EVENT SHALL JHU/APL BE LIABLE TO ANY USER OF THE MATERIAL FOR ANY ACTUAL, INDIRECT, CONSEQUENTIAL, SPECIAL OR OTHER DAMAGES ARISING FROM THE USE OF, OR INABILITY TO USE, THE MATERIAL, INCLUDING, BUT NOT LIMITED TO, ANY DAMAGES FOR LOST PROFITS.

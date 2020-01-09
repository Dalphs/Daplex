const mysql = require('mysql2/promise');
const Sequelize = require('sequelize');

// Tools regarding Helpdesk Catogories Table -Team Cyclone
const helpdeskCategories = require('./helpdeskCategoriesTable');
const propertyTypes = require('./propertyTypesDbTools');

// database tools import for thresholds - Team Cyclone
const htt = require('./ThresholdsDbTools');
const wtt = require('./WaterThresholdsDbTools');
const ptt = require('./PowerThresholdsDbTools');
const hett = require('./HeatThresholdsDbTools');
const dtt = require('./DamageThresholdDbTools');
const pt = require('./powerDBTools.js');

const host = '127.0.0.1';
const user = 'root';
const password = 'password';
const database = 'daplex';
const sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: 'mysql',
    define: {
        timestamps: false
    },
    logging: false,
    timezone: '+01:00'
});

function getPropertiesTable() {
    return sequelize.define('properties', {
        property_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        property_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        property_size: {
            type: Sequelize.DOUBLE,
            allowNull: true
        },
        property_type_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        color: {
            type: Sequelize.STRING,
            allowNull: true
        },
        electricity_meter: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        heat_meter: {
            type: Sequelize.INTEGER,
            allowNull: true
        }
    });
}

function getHelpdeskTable() {
    return sequelize.define('helpdesk_data', {
        helpdesk_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        number: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        subject: {
            type: Sequelize.STRING,
            allowNull: true
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        submission_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        expected_execution_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        submitter_name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        submitter_email: {
            type: Sequelize.STRING,
            allowNull: true
        },
        submitter_phone: {
            type: Sequelize.STRING,
            allowNull: true
        },
        property_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        updated: {
            type: Sequelize.DATE,
            allowNull: true
        },
        building: {
            type: Sequelize.STRING,
            allowNull: true
        },
        room_number: {
            type: Sequelize.STRING,
            allowNull: true
        },
        placement_description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        responsible: {
            type: Sequelize.STRING,
            allowNull: true
        },
        status: {
            type: Sequelize.STRING,
            allowNull: true
        }
    });
}

function getStateWeightTable() {
    return sequelize.define('state_weight_data', {
        property_type_id: {
            type: Sequelize.INTEGER,
            autoIncrement: false,
            primaryKey: true
        },
        state_tekniske: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        state_udvendige: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        state_osv: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
}

function getOverallWeightTable() {
    return sequelize.define('overall_weight_data', {
        property_type_id: {
            type: Sequelize.INTEGER,
            autoIncrement: false,
            primaryKey: true
        },
        overall_tilstand: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        overall_energi: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        overall_helpdesk: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
}

function getHelpdeskWeightTable() {
    return sequelize.define('helpdesk_weight_data', {
        property_type_id: {
            type: Sequelize.INTEGER,
            autoIncrement: false,
            primaryKey: true
        },
        helpdesk_indeklima: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        helpdesk_teknisk: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        helpdesk_udv_b: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        helpdesk_mur_facade: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        helpdesk_tag: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        helpdesk_ud_gavl: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        helpdesk_tagdaekning: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        helpdesk_tag_ned: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        helpdesk_vinduer: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        helpdesk_fundament: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    });
}

function getMaintenanceTable() {
    return sequelize.define('maintenance_data', {
        maintenance_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        property_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        year: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        cost: {
            type: Sequelize.DOUBLE,
            allowNull: true
        }
    });
}

function getWaterTable() {
    return sequelize.define('water_data', {
        water_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        property_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        volume: {
            type: Sequelize.DOUBLE,
            allowNull: true
        }
    });
}

function getHeatTable() {
    return sequelize.define('heat_data', {
        heat_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        property_id: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        kWh: {
            type: Sequelize.DOUBLE,
            allowNull: true
        }
    });
}

/**
 * Function for creating the database itself. Sequelize can't do that.
 * @param host
 * @param user
 * @param password
 * @returns {Promise<void>}
 */
exports.setupDatabase = async function (host, user, password) {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password
        });

        let queryCreateDatabase = "CREATE DATABASE IF NOT EXISTS daplex";
        await connection.query(queryCreateDatabase); // Create the database
    } catch (e) {
        console.log('throwing error in database')
        throw e;
    } finally {
        if (connection)
            connection.end();
        exports.setupTables();
    }
};

exports.setupDatabase(host, user, password);

/**
 * Function for creating the tables.
 * @returns {Promise<void>}
 */
exports.setupTables = async function () {
    let propertiesTable = getPropertiesTable();
    let propertyTypeTable = propertyTypes.getPropertyTypesTable(sequelize, Sequelize);
    let helpdeskCategoriesTable = helpdeskCategories.getHelpdeskCategoriesTable(sequelize, Sequelize);
    let helpdeskTable = getHelpdeskTable();
    let helpdeskWeightTable = getHelpdeskWeightTable();
    let helpdeskThresholdTable = htt.getHelpdeskThresholdsTable(sequelize, Sequelize);
    let waterThresholdTable = wtt.getWaterThresholdsTable(sequelize, Sequelize);
    let powerThresholdTable = ptt.getPowerThresholdsTable(sequelize, Sequelize);
    let heatThresholdTable = hett.getHeatThresholdsTable(sequelize, Sequelize);
    let damageThresholdtable = dtt.getDamageThresholdsTable(sequelize, Sequelize);
    let maintenanceTable = getMaintenanceTable();
    let stateWeightTable = getStateWeightTable();
    let overallWeightTable = getOverallWeightTable();
    let waterTable = getWaterTable();
    let heatTable = getHeatTable();
    let powerTable = pt.getPowerTable(sequelize, Sequelize);

    helpdeskTable.belongsTo(propertiesTable, {foreignKey: 'property_id'});
    maintenanceTable.belongsTo(propertiesTable, {foreignKey: 'property_id'});
    propertiesTable.belongsTo(propertyTypeTable, {foreignKey: 'property_type_id'});

    await propertyTypeTable.sync({force: false});
    await propertiesTable.sync({force: false});
    await helpdeskCategoriesTable.sync({force: false});
    await helpdeskTable.sync({force: false});
    await helpdeskWeightTable.sync({force: false});
    await helpdeskThresholdTable.sync({force: false});
    await waterThresholdTable.sync({force: false});
    await powerThresholdTable.sync({force: false});
    await heatThresholdTable.sync({force: false});
    await damageThresholdtable.sync({force: false});
    await stateWeightTable.sync({force: false});
    await maintenanceTable.sync({force: false});
    await overallWeightTable.sync({force: false});
    await waterTable.sync({force: false});
    await heatTable.sync({force: false});
    await powerTable.sync({force: false});

    // Generation of start data for the database
    await generateStartData();
};


/**
 * Generates data for the database that should be present at
 * the start of system. - Team Cyclone
 */
generateStartData = async() => {

    try{
        await hct.read();
    } catch (e){
        hct.create("Indeklima");
        hct.create("Tekniske Anlæg");
        hct.create("Udvendig Belægning");
        hct.create("Murværk og Facade");
        hct.create("Tag");
        hct.create("Udhæng og Gavle");
        hct.create("Tagdækning");
        hct.create("Tagrender og Nedløb");
        hct.create("Vinduer og Udvendige Døre");
        hct.create("Fundament og Sokkel");
    }

    try{
        await prtt.read();
    } catch (e){
        prtt.create(420, "Skole");
        prtt.create(440, "Daginstitution");
    }

}

/**
 * Function for creating a new property (ejendom).
 */
exports.createProperty = async function (propertyName, propertySize = 1000, propertyTypeId = 1, electricityMeter, heatMeter) {
    try {
        let propertiesTable = getPropertiesTable();

        let result = await propertiesTable.create({
            property_name: propertyName,
            property_size: propertySize,
            property_type_id: propertyTypeId,
            electricity_meter: electricityMeter,
            heat_meter: heatMeter
        });

        return result.dataValues.property_id; // Return the autogenerated ID of the inserted row
    } catch (e) {
        throw e;
    }
};

exports.updatePropertyColor = async function (id, color) {
    try {
        let propertiesTable = getPropertiesTable();
        await propertiesTable.update(
            {color: color},
            {where: {property_id: id}});
    } catch (e) {
        throw e;
    }
};

/**
 * Function for creating new helpdesk data.
 * @param helpdeskArray
 * @returns {Promise<[]>}
 */
exports.createHelpdeskData = async function (helpdeskArray) {
    try {
        let helpdeskTable = getHelpdeskTable();
        let resultsArray = [];
        let propertiesTable = getPropertiesTable();

        for (let helpdeskObject of helpdeskArray) { // Loop through all the data
            let propertyId = await propertiesTable.findAll(({where: {property_name: helpdeskObject['Ejendom']}})); // Check whether the property exists

            if (propertyId.length === 0) // If the results array have a length of 0, the property doesn't exist
                propertyId = await exports.createProperty(helpdeskObject['Ejendom']); // Create a new property
            else
                propertyId = propertyId[0].dataValues.property_id;

            let result = await helpdeskTable.create({
                number: helpdeskObject['Nr.'],
                subject: helpdeskObject['Emne'],
                description: helpdeskObject['Beskrivelse'],
                submission_date: helpdeskObject['Indmeldelsesdato'],
                expected_execution_date: helpdeskObject['Forventet udførelsesdato'] == '' ? null: helpdeskObject['Forventet udførelsesdato'],
                submitter_name: helpdeskObject['Indmelders navn'],
                submitter_email: helpdeskObject['Indmelders e-mail'],
                submitter_phone: helpdeskObject['Indmelders tlfnr.'],
                property_id: propertyId,
                updated: helpdeskObject['Opdateret'],
                building: helpdeskObject['Bygning'],
                room_number: helpdeskObject['Rumnr.'],
                placement_description: helpdeskObject['Placeringsbeskrivelse'],
                responsible: helpdeskObject['Ansvarlig'],
                status: helpdeskObject['Status'],
            });

            resultsArray.push(result.dataValues.helpdesk_id)
        }

        return resultsArray; // Return an array containing all inserted IDs
    } catch (e) {
        throw e;
    }
};

exports.createHelpdeskWeightTable = async function (helpdeskWeightArray) {
    try {
        let helpdeskWeightTable = getHelpdeskWeightTable();
        let resultsArray = [];
        let result = await helpdeskWeightTable.create({
            property_type_id: helpdeskWeightArray[0],
            helpdesk_indeklima: helpdeskWeightArray[1],
            helpdesk_teknisk: helpdeskWeightArray[2],
            helpdesk_udv_b: helpdeskWeightArray[3],
            helpdesk_mur_facade: helpdeskWeightArray[4],
            helpdesk_tag: helpdeskWeightArray[5],
            helpdesk_ud_gavl: helpdeskWeightArray[6],
            helpdesk_tagdaekning: helpdeskWeightArray[7],
            helpdesk_tag_ned: helpdeskWeightArray[8],
            helpdesk_vinduer: helpdeskWeightArray[9],
            helpdesk_fundament: helpdeskWeightArray[10]
        });
        resultsArray.push(result.dataValues.property_type_id);
        return resultsArray; // Return an array containing all inserted IDs
    } catch (e) {
        throw e;
    }
};

exports.createOverallWeightTable = async function (helpdeskWeightArray) {
    try {
        let overallWeightTable = getOverallWeightTable();
        let resultsArray = [];
        let result = await overallWeightTable.create({
            property_type_id: helpdeskWeightArray[0],
            overall_tilstand: helpdeskWeightArray[1],
            overall_energi: helpdeskWeightArray[2],
            overall_helpdesk: helpdeskWeightArray[3]
        });
        resultsArray.push(result.dataValues.property_type_id);
        return resultsArray; // Return an array containing all inserted IDs
    } catch (e) {
        throw e;
    }
};

// SLET VENLIGST IKKE DENNE LINJE
// exports.createHelpdeskWeightTable([420, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
// SLET VENLIGST IKKE DENNE LINJE

exports.createStateWeightTable = async function (stateWeightArray) {
    try {
        let stateWeightTable = getStateWeightTable();
        let resultsArray = [];
        let result = await stateWeightTable.create({
            property_type_id: stateWeightArray[0],
            state_tekniske: stateWeightArray[1],
            state_udvendige: stateWeightArray[2],
            state_osv: stateWeightArray[3]
        });

        resultsArray.push(result.dataValues.property_type_id);
        console.log(resultsArray[0]);

        return resultsArray; // Return an array containing all inserted IDs
    } catch (e) {
        throw e;
    }
};

exports.updateHelpdeskWeightTable = async function (helpdeskWeightArray) {
    try {
        let helpdeskWeightTable = getHelpdeskWeightTable();
        let resultsArray = [];
        let result = await helpdeskWeightTable.update({
            helpdesk_indeklima: helpdeskWeightArray[1],
            helpdesk_teknisk: helpdeskWeightArray[2],
            helpdesk_udv_b: helpdeskWeightArray[3],
            helpdesk_mur_facade: helpdeskWeightArray[4],
            helpdesk_tag: helpdeskWeightArray[5],
            helpdesk_ud_gavl: helpdeskWeightArray[6],
            helpdesk_tagdaekning: helpdeskWeightArray[7],
            helpdesk_tag_ned: helpdeskWeightArray[8],
            helpdesk_vinduer: helpdeskWeightArray[9],
            helpdesk_fundament: helpdeskWeightArray[10]
        }, {returning: true, where: {property_type_id: helpdeskWeightArray[0]}});


        resultsArray.push(result.dataValues);
        console.log(resultsArray[0]);

        return resultsArray; // Return an array containing all inserted IDs
    } catch (e) {
        throw e;
    }
};

exports.updateStateWeightTable = async function (stateWeightArray) {
    try {
        let stateWeightTable = getStateWeightTable();
        let resultsArray = [];
        console.log(stateWeightArray[1]);
        let result = await stateWeightTable.update({
            state_tekniske: stateWeightArray[1],
            state_udvendige: stateWeightArray[2],
            state_osv: stateWeightArray[3],
        }, {returning: true, where: {property_type_id: stateWeightArray[0]}});


        resultsArray.push(result.dataValues);
        console.log(resultsArray[0]);

        return resultsArray; // Return an array containing all inserted IDs
    } catch (e) {
        throw e;
    }
};

exports.updateOverallWeightTable = async function (overallWeightArray) {
    try {
        let overallWeightTable = getOverallWeightTable();
        let resultsArray = [];
        let result = await overallWeightTable.update({
            overall_tilstand: overallWeightArray[1],
            overall_energi: overallWeightArray[2],
            overall_helpdesk: overallWeightArray[3],
        }, {returning: true, where: {property_type_id: overallWeightArray[0]}});


        resultsArray.push(result.dataValues);
        console.log(resultsArray[0]);

        return resultsArray; // Return an array containing all inserted IDs
    } catch (e) {
        throw e;
    }
};

exports.readHelpdeskWeightData = async function (id) {
    try {
        let weightTable = getHelpdeskWeightTable();
        let result = await weightTable.findAll((id ? {where: {property_type_id: id}} : {}));// Add the "where" option, if the ID is not undefined
        let defaultData = [id, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]; // Deafault values for sliders
        return result.length === 0 ? defaultData : result[0].dataValues; // Return deafaultData if 0 results are found, else return the result(s)
    } catch (e) {
        throw e;
    }
};

exports.readStateWeightData = async function (id) {
    try {
        let weightTable = getStateWeightTable();
        let result = await weightTable.findAll((id ? {where: {property_type_id: id}} : {}));// Add the "where" option, if the ID is not undefined
        let defaultData = [id, 50, 50, 50]; // Default values for sliders
        return result.length === 0 ? defaultData : result[0].dataValues; // Return defaultData if 0 results are found, else return the result(s)
    } catch (e) {
        throw e;
    }
};

exports.readOverallWeightData = async function (id) {
    try {
        let weightTable = getOverallWeightTable();
        let result = await weightTable.findAll((id ? {where: {property_type_id: id}} : {}));// Add the "where" option, if the ID is not undefined
        let defaultData = [id, 50, 50, 50]; // Default values for sliders
        return result.length === 0 ? defaultData : result[0].dataValues; // Return defaultData if 0 results are found, else return the result(s)
    } catch (e) {
        throw e;
    }
};

exports.createHelpdeskLimit = async function (helpdeskLimitArray) {
    try {
        let helpdeskLimitsTable = getHelpdeskLimitsTable();
        let resultsArray = [];

        let result = await helpdeskLimitsTable.create({
            helpdesk_indeklima: helpdeskLimitArray[0],
            helpdesk_tekniske_anlaeg: helpdeskLimitArray[1],
            helpdesk_udv_belaegning: helpdeskLimitArray[2],
            helpdesk_murwaerk_og_facade: helpdeskLimitArray[3],
            helpdesk_tag: helpdeskLimitArray[4],
            helpdesk_udhaeng_og_gavle: helpdeskLimitArray[5],
            helpdesk_tagdaekning: helpdeskLimitArray[6],
            helpdesk_tagrender_og_nedloeb: helpdeskLimitArray[7],
            helpdesk_vinduer_og_udv_doere: helpdeskLimitArray[8],
            helpdesk_fundament_og_sokkel: helpdeskLimitArray[9]
        });

        resultsArray.push(result.dataValues);

        return resultsArray; // Return an array containing all inserted IDs
    } catch (e) {
        throw e;
    }
};

exports.createMaintenanceData = async function (maintenanceDataArray) {
    try {
        let maintenanceTable = getMaintenanceTable();
        let resultsArray = [];
        let propertiesTable = getPropertiesTable();

        for (let maintenanceObject of maintenanceDataArray) { // Loop through all the data
            let propertyNameTrimmed = maintenanceObject['Ejendom'].replace(/\(\d+\)/, "").trim();

            let year = Object.keys(maintenanceObject)[0];

            let propertyId = await propertiesTable.findAll(({where: {property_name: propertyNameTrimmed}})); // Check whether the property exists

            if (propertyId.length === 0) // If the results array have a length of 0, the property doesn't exist
                propertyId = await exports.createProperty(propertyNameTrimmed); // Create a new property
            else
                propertyId = propertyId[0].dataValues.property_id;

            let propertyExistsInMaintenanceTable = await maintenanceTable.findAll(({where: {property_id: propertyId, year: year}})); // Check whether the property exists in the maintenance table

            if (propertyExistsInMaintenanceTable.length === 0) { // Only create maintenance data if the property doesn't already exist in the maintenance table
                let result = await maintenanceTable.create({
                    property_id: propertyId,
                    year: year,
                    cost: maintenanceObject['2019']
                });

                resultsArray.push(result.dataValues.maintenance_id)
            }
        }

        return resultsArray; // Return an array containing all inserted IDs
    } catch (e) {
        throw e;
    }
};

exports.createWaterData = async function (waterDataArray, propertyName) {
    try {
        let waterTable = getWaterTable();
        let resultsArray = [];

        let trimmedPropertyName1 = propertyName.replace("Vanddata fra ", "");
        let trimmedPropertyName2 = trimmedPropertyName1.slice(0, trimmedPropertyName1.lastIndexOf("-") - 1); // Trim property name
        let propertiesTable = getPropertiesTable();
        let propertyId = await propertiesTable.findAll(({where: {property_name: trimmedPropertyName2}})); // Check whether the property exists
        if (propertyId.length === 0) // If the results array have a length of 0, the property doesn't exist
            propertyId = await exports.createProperty(trimmedPropertyName2); // Create a new property
        else
            propertyId = propertyId[0].dataValues.property_id;

        for (let waterObject of waterDataArray) { // Loop through all the data
            if (waterObject.Dato.search("23:") >= 0) { // Only save 1 water data per day (the one from 23:05)
                let result = await waterTable.create({
                    property_id: propertyId,
                    date: waterObject.Dato.replace("23:", "00:"), // For some when it's saved, it's 1 hour off
                    volume: waterObject['Volumen (m�)']
                });

                resultsArray.push(result.dataValues.maintenance_id)
            }
        }

        return resultsArray; // Return an array containing all inserted IDs
    } catch (e) {
        throw e;
    }
};

exports.createHeatData = async function (heatDataArray, propertiesObject) {
    try {
        let heatTable = getHeatTable();
        let propertiesTable = getPropertiesTable();
        let resultsArray = [];

        for (let heatObject of heatDataArray) { // Loop through all the data
            if (heatObject['3'].search("23:") >= 0) { // Only save 1 heat data per day (the one from 23:XX)
                let heatMeter = heatObject['1'];

                let propertyId = await propertiesTable.findAll(({where: {heat_meter: heatMeter}})); // Check whether the property exists
                if (propertyId.length === 0) { // If the results array have a length of 0, the property doesn't exist
                    let propertyName = propertiesObject[heatMeter]; // Get property name
                    propertyId = await exports.createProperty(propertyName, undefined, undefined, undefined, heatMeter); // Create a new property
                } else
                    propertyId = propertyId[0].dataValues.property_id;

                let result = await heatTable.create({
                    property_id: propertyId,
                    date: heatObject['3'], // For some when it's saved, it's 1 hour off
                    kWh: heatObject['5']
                });

                resultsArray.push(result.dataValues.maintenance_id)
            }
        }

        return resultsArray; // Return an array containing all inserted IDs
    } catch (e) {
        throw e;
    }
};

exports.checkProperties = async function (heatDataArray) {
    let unknownProperties = {};
    let propertiesTable = getPropertiesTable();

    for (let heatObject of heatDataArray) {
        if (heatObject['3'].search("23:") >= 0) {
            let heatMeter = heatObject['1'];
            if (heatMeter) {
                let propertyId = await propertiesTable.findAll(({where: {heat_meter: heatMeter}})); // Check whether the property exists
                if (propertyId.length === 0) // If the results array have a length of 0, the property doesn't exist
                    unknownProperties[heatMeter] = null;
            }
        }
    }

    return unknownProperties;
};


exports.readProperty = async function (id) {
    try {
        let propertiesTable = getPropertiesTable();
        let result = await propertiesTable.findAll((id ? {where: {property_id: id}} : {})); // Add the "where" option, if the ID is not undefined
        return result.length === 0 ? await Promise.reject(new Error("No properties found")) : result; // Return an error, if 0 results are found, else return the result(s)
    } catch (e) {
        throw e;
    }
};

exports.readHelpdeskData = async function (id) {
    try {
        let helpdeskTable = getHelpdeskTable();
        let result = await helpdeskTable.findAll((id ? {where: {property_type_id: id}} : {})); // Add the "where" option, if the ID is not undefined
        return result.length === 0 ? await Promise.reject(new Error("No helpdesk data found")) : result; // Return an error, if 0 results are found, else return the result(s)
    } catch (e) {
        throw e;
    }
};

exports.readHelpdeskDataOneYearBack = async function () {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: host,
            user: user,
            password: password,
            database: database
        });

        let query = "SELECT * FROM `helpdesk_data` WHERE `submission_date` > DATE_SUB(CURDATE(), INTERVAL 1 YEAR)";
        let result = await connection.query(query);
        return result.length === 0 ? await Promise.reject(new Error("No helpdesk data found")) : result;
    } catch (e) {
        throw e;
    } finally {
        if (connection)
            connection.end();
    }
};

exports.readHelpdeskWeight = async function (id) {
    try {
        let helpdeskWeightTable = getHelpdeskWeightTable();
        let result = await helpdeskWeightTable.findAll((id ? {where: {property_type_id: id}} : {})); // Add the "where" option, if the ID is not undefined
        return result.length === 0 ? await Promise.reject(new Error("No helpdesk weight data found")) : result; // Return an error, if 0 results are found, else return the result(s)
    } catch (e) {
        throw e;
    }
};

exports.readMaintenanceData = async function (id) {
    try {
        let maintenanceTable = getMaintenanceTable();
        let result = await maintenanceTable.findAll((id ? {where: {property_id: id}} : {})); // Add the "where" option, if the ID is not undefined
        return result.length === 0 ? await Promise.reject(new Error("No maintenance data found")) : result; // Return an error, if 0 results are found, else return the result(s)
    } catch (e) {
        throw e;
    }
};

//exports.readMaintenanceData().then(res => console.log(res[0].dataValues));

exports.readMaintenanceDataOneYearBack = async function () {
    try {
        let currentYear = new Date().getFullYear();
        let maintenanceTable = getMaintenanceTable();
        let result = await maintenanceTable.findAll({where: {year: currentYear}});
        return result.length === 0 ? await Promise.reject(new Error("No maintenance data found for this year")) : result; // Return an error, if 0 results are found, else return the result(s)
    } catch (e) {
        throw e;
    }
};

exports.readWaterData = async function (id) {
    try {
        let waterTable = getWaterTable();
        let result = await waterTable.findAll((id ? {where: {property_id: id}} : {})); // Add the "where" option, if the ID is not undefined
        return result.length === 0 ? await Promise.reject(new Error("No water data found")) : result; // Return an error, if 0 results are found, else return the result(s)
    } catch (e) {
        throw e;
    }
};

exports.readHeatData = async function (id) {
    try {
        let heatTable = getHeatTable();
        let result = await heatTable.findAll((id ? {where: {property_id: id}} : {})); // Add the "where" option, if the ID is not undefined
        return result.length === 0 ? await Promise.reject(new Error("No heat data found")) : result; // Return an error, if 0 results are found, else return the result(s)
    } catch (e) {
        throw e;
    }
};

exports.processHelpdeskData = async function (resultPerProperty) {
    let helpdeskData = await exports.readHelpdeskDataOneYearBack();

    for (let data of helpdeskData[0]) { // Count helpdesk reports for each property
        let helpdeskSubject = data.subject;
        let propertyId = data.property_id;

        if (!resultPerProperty[propertyId])
            resultPerProperty[propertyId] = {};

        resultPerProperty[propertyId][helpdeskSubject] = (resultPerProperty[propertyId][helpdeskSubject] ? resultPerProperty[propertyId][helpdeskSubject] + 1 : 1);
    }

    let helpdeskWeights = await exports.readHelpdeskWeight();
    let map = {
        'Lys og el': 'helpdesk_indeklima',
        'Tekniske anlæg': 'helpdesk_teknisk',
        'Varme og ventilation': 'helpdesk_udv_b',
        '0': 'helpdesk_mur_facade',
        '1': 'helpdesk_tag',
        '2': 'helpdesk_ud_gavl',
        '3': 'helpdesk_tagdaekning',
        '4': 'helpdesk_tag_ned',
        'Vinduer, døre og konstruktion': 'helpdesk_vinduer',
        '5': 'helpdesk_fundament'
    };

    for (let propertyId in resultPerProperty) { // Loop through each property, which has helpdesk data
        if (resultPerProperty.hasOwnProperty(propertyId)) {
            let property = await exports.readProperty(propertyId);
            let propertyTypeId = property[0].dataValues.property_type_id;
            let weightsObject;

            for (let helpdeskWeight of helpdeskWeights) { // Loop through helpdesk weights to find the matching weight for the property type
                if (helpdeskWeight.dataValues.property_type_id === propertyTypeId) {
                    weightsObject = helpdeskWeight.dataValues;
                    break;
                }
            }

            let totalScore = 0;

            for (let subject in resultPerProperty[propertyId]) { // Loop through each individual helpdesk subject, which has 1 or more reports
                if (resultPerProperty[propertyId].hasOwnProperty(subject)) {
                    let numberOfReports = resultPerProperty[propertyId][subject];
                    let subjectDatabaseName = map[subject];
                    let multiplier = weightsObject[subjectDatabaseName] / 100; // Get the multiplier for the current subject
                    console.log(multiplier);
                    totalScore += numberOfReports * multiplier; // Add the score to the total score
                }
            }

            resultPerProperty[propertyId].helpdeskScore = totalScore;
        }
    }

    return resultPerProperty;
};

// exports.processHelpdeskData();

exports.processMaintenanceData = async function (resultPerProperty) {
    let maintenanceData = await exports.readMaintenanceDataOneYearBack();
    let propertiesTable = getPropertiesTable();

    for (let data of maintenanceData) {
        let propertyId = data.dataValues.property_id;

        if (!resultPerProperty[propertyId])
            resultPerProperty[propertyId] = {};

        let property = await propertiesTable.findAll(({where: {property_id: propertyId}}));
        let propertySize = property[0].dataValues.property_size;
        resultPerProperty[propertyId].maintenanceScore = data.dataValues.cost / propertySize;
    }

    return resultPerProperty;
};

// exports.processMaintenanceData({});

exports.calculateScore = async function () {
    let resultPerProperty = {};
    resultPerProperty = await exports.processHelpdeskData(resultPerProperty);
    resultPerProperty = await exports.processMaintenanceData(resultPerProperty);

    for (let propertyId in resultPerProperty) {
        if (resultPerProperty.hasOwnProperty(propertyId)) {
            let totalScore = 0;

            if (resultPerProperty[propertyId].helpdeskScore) {
                let helpdeskScore = resultPerProperty[propertyId].helpdeskScore;
                totalScore += (helpdeskScore <= 0.3 ? 1 : (helpdeskScore <= 0.6) ? 2 : 3);
            }

            if (resultPerProperty[propertyId].maintenanceScore) {
                let maintenanceScore = resultPerProperty[propertyId].maintenanceScore;
                totalScore += (maintenanceScore <= 3 ? 1 : (maintenanceScore <= 6) ? 2 : 3);
            }

            if (totalScore < 1)
                await exports.updatePropertyColor(propertyId, "Grøn");
            else if (totalScore < 3)
                await exports.updatePropertyColor(propertyId, "Gul");
            else
                await exports.updatePropertyColor(propertyId, "Rød");
        }
    }
};

// exports.calculateScore();

// CRUD for helpdesk categories stored in an Object that's being exportet. - Team Cyclone
var hct = {};
hct.create = (categoryName) => helpdeskCategories.createHelpdeskCategory(categoryName, sequelize, Sequelize);
hct.read = (id) => helpdeskCategories.readHelpdeskCategory(id, sequelize, Sequelize);
hct.update = (id, categoryName) => helpdeskCategories.updateHelpdeskCategory(id, categoryName, sequelize, Sequelize);
hct.delete = (id) => helpdeskCategories.deleteHelpdeskCategory(id, sequelize, Sequelize);

exports.hct = hct;

var prtt = {};
prtt.create = (typeId, name) => propertyTypes.createPropertyType(typeId, name, sequelize, Sequelize);
prtt.read = (id) => propertyTypes.readPropertyType(id, sequelize, Sequelize);
prtt.update = (typeId, name) => propertyTypes.updatePropertyType(typeId, name, sequelize, Sequelize);
prtt.delete = (id) => propertyTypes.deletePropertyType(id, sequelize, Sequelize);

exports.prtt = prtt;

// DB Tools export from ThresholdDbTools - Team Cyclone
exports.createHelpdeskThreshold = (yellowThreshold, redThreshold, categoryId, propertyId) => {htt.createHelpdeskThreshold(yellowThreshold, redThreshold, categoryId, propertyId, sequelize, Sequelize)};
exports.readHelpdeskThreshold = (id) => {htt.readHelpdeskThreshold(id, sequelize, Sequelize)};
exports.updateHelpdeskThreshold = (id, propertyId, categoryId, yellowThreshold, redThreshold) => htt.updateHelpdeskThreshold(id, propertyId,  categoryId, yellowThreshold, redThreshold, sequelize, Sequelize);
exports.deleteHelpdeskThreshold = (id) => htt.deleteHelpdeskThreshold(id, sequelize, Sequelize);


// DB Tools export from WaterThresholdDbTools - Team Cyclone
exports.createWaterThreshold = (yellowThreshold, redThreshold, propertyId) => {wtt.createWaterThreshold(yellowThreshold, redThreshold, propertyId, sequelize, Sequelize)};
exports.readWaterThreshold = (id) => {wtt.createWaterThreshold(id, sequelize, Sequelize)};
exports.updateWaterThreshold = (id, propertyId, yellowThreshold, redThreshold) => wtt.updateWaterThreshold(id, propertyId, yellowThreshold, redThreshold, sequelize, Sequelize);
exports.deleteWaterThreshold = (id) => wtt.deleteWaterThreshold(id, sequelize, Sequelize);

// DB Tools export from PowerThresholdDbTools - Team Cyclone
exports.createPowerThreshold = (yellowThreshold, redThreshold, propertyId) => {ptt.createPowerThreshold(yellowThreshold, redThreshold, propertyId, sequelize, Sequelize)};
exports.readPowerThreshold = (id) => {ptt.createPowerThreshold(id, sequelize, Sequelize)};
exports.updatePowerThreshold = (id, propertyId, yellowThreshold, redThreshold) => ptt.updatePowerThreshold(id, propertyId, yellowThreshold, redThreshold, sequelize, Sequelize);
exports.deletePowerThreshold = (id) => ptt.deletePowerThreshold(id, sequelize, Sequelize);

// DB Tools export from HeatThresholdDbTools - Team Cyclone
exports.createHeatThreshold = (yellowThreshold, redThreshold, propertyId) => {hett.createHeatThreshold(yellowThreshold, redThreshold, propertyId, sequelize, Sequelize)};
exports.readHeatThreshold = (id) => {hett.createHeatThreshold(id, sequelize, Sequelize)};
exports.updateHeatThreshold = (id, propertyId, yellowThreshold, redThreshold) => hett.updateHeatThreshold(id, propertyId, yellowThreshold, redThreshold, sequelize, Sequelize);
exports.deleteHeatThreshold = (id) => hett.deleteHeatThreshold(id, sequelize, Sequelize);

// DB Tools export from DamageThresholdDbTools - Team Cyclone
exports.createDamageThreshold = (yellowThreshold, redThreshold, propertyId) => {hett.createHeatThreshold(yellowThreshold, redThreshold, propertyId, sequelize, Sequelize)};
exports.readDamageThreshold = (id) => {hett.createHeatThreshold(id, sequelize, Sequelize)};
exports.updateDamageThreshold = (id, propertyId, yellowThreshold, redThreshold) => hett.updateHeatThreshold(id, propertyId, yellowThreshold, redThreshold, sequelize, Sequelize);
exports.deleteDamageThreshold = (id) => hett.deleteHeatThreshold(id, sequelize, Sequelize);

// DB Tools export from powerTable - Team Hurricane
exports.createPower = (power) =>  {pt.createPower(power, sequelize, Sequelize)};
exports.readPower = (installationNumber) =>  {pt.readPower(installationNumber, sequilize, Sequilize)};
exports.deletePower = (id) => {pt.deletePower(id, sequilize, Sequilize)};
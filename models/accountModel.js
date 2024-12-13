const { ObjectId } = require('mongoose').Types;
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        account_type: {
            type: String,
            required: true
        },
        balance: {
            type: Number,
            required: false,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Account', accountSchema);

/*<==========================STUDYING====================================> */

// iterates on the schema wich was given
accountSchema.eachPath((pathname, schematype) => {
    // console.log(pathname, schematype);
});

// creates methods
accountSchema.method({
    sendMoney: function () {
        console.log("Money has been sent");
    },
    receiveMoney: function () {
        console.log("Money has been received");
    }
});

const Account = mongoose.model('Account', accountSchema);
const newAccount = new Account;

// newAccount.sendMoney();
// newAccount.receiveMoney();

const bulkOperations = [
    {
        updateOne: {
            filter: { _id: "675c7ccfb8b2193ba5524bf8" },
            update: { $set: { balance: 10000 }},
            upsert: false
        }
    }
];

async function runBulkWrite() {
    await mongoose.connect('mongodb+srv://gustavomoraes:senha123@cluster0.y0xgp.mongodb.net/');

    try {
        const result = await Account.bulkWrite(bulkOperations);
        console.log('Bulk write result:', result);
    } catch (error) {
        console.error('Error in bulk write:', error); 
    } finally { 
        await mongoose.connection.close();
    }
}

// runBulkWrite();



const users = require('../model/userSchema')
const jwt = require('jsonwebtoken');

// register logic
exports.register = async (req, res) => {
    console.log("Inside Register Function");

    // get data from req body--- destructuring
    const { username, acno, password } = req.body

    try {
        // check acno in users model
        const result = await users.findOne({ acno })
        if (result) {
            // if acno exsists,send response as "already exsist" 406-- cannot process 
            res.status(406).json("Account already exsist, please login ")
        }
        else {
            // if acno not exsist , add to users model, send response as "success"
            const newUser = new users({
                username, acno, password, balance: 5000, transactions: []
            })
            // to save changes in mongoose  to mongodb
            await newUser.save()
            // send response as success 200-- success
            res.status(200).json(newUser)
        }
    }
    catch (err) {
        res.status(401).json(err) // 401 mean error in catch

    }


}
// login logic
exports.login = async (req, res) => {

    // get data from req body
    const { acno, password } = req.body
    console.log("inside login function");
    try {
        // check acno in mongodb

        const bankUser = await users.findOne({ acno, password })
        if (bankUser) {
            // user already exsist 
            const token = jwt.sign({ loginAcno: acno }, "supersecretkey12345")

            res.status(200).json(
                {
                    loginUser: bankUser,
                    token,
                })
        }

        else {
            res.status(404).json("Invalid Account Number or Password")
        }
    }
    catch {
        res.status(404).json(err)
    }
}

// get balance

exports.getbalance = async (req, res) => {
    // get acno from req
    const { acno } = req.params
    try {
        const response = await users.findOne({ acno })
        if (response) {
            // acno exsist
            res.status(200).json(response.balance)
        }
        else {
            // acno not exsist
            res.status(404).json("Account not found")
        }
    }
    catch (err) {
        res.status(401).json(err)
    }
}

// fund transfer
exports.fundtransfer = async (req, res) => {

    console.log("inside fund transfer");
    // debit acno
    const { loginData } = req
    console.log((loginData));

    // get data from request:creditAcno,amount
    const { creditAcno, amount } = req.body
    let amt = Number(amount)
    try {
        // check debit acno in mongodb
        const debitUser = await users.findOne({ acno: loginData })
        console.log(debitUser);

        // get credit user details
        const creditUser = await users.findOne({ acno: creditAcno });
        console.log(creditUser);

        if (loginData == creditAcno) {
            res.status(406).json("Operation Denied !!!")
        }
        else {

            if (creditUser) {
                // insufficient balance for debit user
                if (debitUser.balance >= amt) {

                    debitUser.balance -= amt
                    debitUser.transactions.push({
                        transaction_type: "DEBIT", amount: amt, toAcno: creditAcno, fromAcno: loginData
                    })
                    await debitUser.save()

                    creditUser.balance += amt
                    creditUser.transactions.push({
                        transaction_type: "CREDIT", amount: amt, toAcno: creditAcno, fromAcno: loginData
                    })
                    await creditUser.save()

                    res.status(200).json("Transaction completed Successfully . You can perform next transaction after some time")
                }
                else {
                    res.status(406).json("Transaction failed ... Insufficent Balance !!!")
                }
            }
            else {
                res.status(404).json("transaction failed ... Invalid Credit Account details !!!");

            }
        }


    }
    catch (err) {
        res.status(401).json(err)

    }

}

// // get transaction
exports.gettransactions = async (req, res) => {

    console.log("inside transaction page");
    // get acno to fetch the trasnsaction
    const { loginData } = req;
    // get all details of this acno from, mongodb
    try {
        const userDetails = await users.findOne({ acno: loginData })
        if (userDetails) {
            const { transactions } = userDetails
            res.status(200).json(transactions)
        }
        else {
            res.status(404).json("Invalid Account Details !!!")
        }
    }
    catch {
        res.status(401).json(err);
    }
}

// delete account
exports.deleteAcno = async (req, res) => {
    // get login data from token
    const { loginData } = req;
    try {
        await users.deleteOne({ acno: loginData })
        res.status(200).json("Account deleted successfully  !!!")
    }
    catch (err) {
        res.status(401).json(err);
    }
}
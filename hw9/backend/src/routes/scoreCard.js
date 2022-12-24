import { Router } from "express";
import ScoreCard from "../models/ScoreCard.js";

const router = Router();

router.delete("/cards", async (_, res) => {
    //delete database
    ScoreCard.deleteMany({})
        .then(() => { res.send({ message: 'Database cleared' }) })
        .catch((error) => { console.log(error) })
});
router.post("/card", async (req, res) => {
    //add/update element
    let item = req.body;
    let filter = { name: item.name, subject: item.subject };
    let updateItem = { name: item.name, subject: item.subject, score: item.score };
    let msg = '';
    ScoreCard.findOne(filter)
        .then((selectedCard) => {
            if (selectedCard) {
                ScoreCard.findOneAndUpdate(filter, updateItem, { new: true })
                    .then(() => {
                        msg = `Updating(${item.name},${item.subject},${item.score})`;
                        ScoreCard.find({ name: item.name }, (error, data) => {
                            let dataArr = data.map((e) => {
                                return ({ name: e.name, subject: e.subject, score: e.score })
                            })
                            res.send({ message: msg, card: filter, querydata: dataArr })
                        })
                    })
                    .catch((error) => { console.log(error) })
            } else {
                const newCard = new ScoreCard(updateItem);
                newCard.save()
                    .then(() => {
                        msg = `Adding(${item.name},${item.subject},${item.score})`;
                        ScoreCard.find({ name: item.name }, (error, data) => {
                            let dataArr = data.map((e) => {
                                return ({ name: e.name, subject: e.subject, score: e.score })
                            })
                            res.send({ message: msg, card: filter, querydata: dataArr })
                        })
                    })
                    .catch((error) => { console.log(error) })
            }
        })
});
router.get("/cards", (req, res) => {
    //find element in database
    const item = req.query;
    if (item.type === 'name') {
        ScoreCard.find({ name: item.queryString }, (error, data) => {
            let messages = data.map((e) => {
                let msg = `Found card with name: (${e.name},${e.subject},${e.score})`
                return msg;
            })
            if (messages.length === 0) {
                messages = [`Name(${item.queryString}) not found`];
            }
            let dataArr = data.map((e) => {
                return ({ name: e.name, subject: e.subject, score: e.score })
            })
            res.send({ messages: messages, err: error, querydata: dataArr })
        })
    } else if (item.type === 'subject') {
        ScoreCard.find({ subject: item.queryString }, (error, data) => {
            let messages = data.map((e) => {
                let msg = `Found card with subject: (${e.name},${e.subject},${e.score})`
                return msg;
            })
            if (messages.length === 0) {
                messages = [`Subject(${item.queryString}) not found`];
            }
            let dataArr = data.map((e) => {
                return ({ name: e.name, subject: e.subject, score: e.score })
            })
            res.send({ messages: messages, err: error, querydata: dataArr })
        })
    }
});
export default router;
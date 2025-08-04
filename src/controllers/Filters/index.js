import mongoose from "mongoose";

class Filters {
    async Menus(req, res) {
        try {
            const dataBase = mongoose.connection
            const categories = await dataBase.collection("constants").findOne({ name: "Categories" })
            res.send({ ok: true, data: { categories: categories?.["Categories"] } })
        } catch (error) {
            return res.status(500).send({
                ok: false,
                error_message: "Server xatoligi",
                error: error.message
            });
        }
    }

    async FilterMenus(req, res) {
        try {
            const dataBase = mongoose.connection
            const categories = await dataBase.collection("constants").findOne({ name: "Filters" })
            res.send({ ok: true, data: { categories: categories?.["Filters"] } })
        } catch (error) {
            return res.status(500).send({
                ok: false,
                error_message: "Server xatoligi",
                error: error.message
            });
        }
    }
}

export default new Filters()
import * as express from "express";

export class EntityGenertator {
    public static getRoute(): express.Router {
        const homeRoute = express.Router();
        homeRoute.get("/", (req, res, next) => {
            res.render("entity_generator\\index");
        });

        return homeRoute;
    }
}

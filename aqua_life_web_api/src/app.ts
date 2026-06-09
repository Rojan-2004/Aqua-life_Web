import express, { Application, NextFunction, Request, Response } from "express";
import { HttpException } from "./exceptions/http-exception";
import { ApiResponseHelper } from "./utils/apihelper.util";
import cors from "cors";
import morgan from "morgan";

import userRoutes from "./routes/user.route";

const app: Application = express();
const corsOptions = {
    origin: ["*", "http://localhost:3000", "http://192.168.100.76:3000"],
    credentials: true,
    successStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));

app.use("/api/v1/auth", userRoutes);

app.use(
    (req: Request, res: Response) => {
        return res.status(404).json({ message: "API not found" });
    }
);

app.use(
    (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error("Error:", err);
        if (err instanceof HttpException) {
            return ApiResponseHelper.error(
                res, err.message, err.status
            );
        }
        return ApiResponseHelper.error(
            res, err?.message || "Internal Server Error", 500
        );
    }
);

export default app;
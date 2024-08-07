import { Request, Response, NextFunction } from "express";

export const parseData = (req: Request, res: Response, next: NextFunction) => {
  if (
    req.method === "POST" &&
    req.headers["content-type"]?.includes("application/x-www-form-urlencoded")
  ) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const formData: { [key: string]: string } = {};
      const parsedData = body.split("&");

      for (const data of parsedData) {
        const [key, value] = data.split("=");
        if (key && value) {
          formData[decodeURIComponent(key)] = decodeURIComponent(
            value.replace(/\+/g, " ")
          );
        }
      }

      req.body = formData;
      next();
    });

    req.on("error", (err) => {
      next(err);
    });
  } else {
    next();
  }
};

import { Response } from "express";

export const response = (
  res: Response,
  data?: any,
  msg: string = "Success",
  code: number = 200,
  meta?: any
) => {
  // Inisialisasi objek resultPrint
  let resultPrint: any = {
    msg,
    status_code: code,
    data: data ?? null,
  };

  // Jika meta ada, tambahkan ke resultPrint
  if (meta) {
    resultPrint.meta = meta;
  }

  // Kirim response dengan status code yang sesuai dan format JSON
  return res.status(resultPrint.status_code).json(resultPrint);
};

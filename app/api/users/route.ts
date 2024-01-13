
//import App from "next/app";
import {data} from "./todo";
import { NextResponse } from "next/server";
//import { todo } from "node:test";


export async function GET(req: Request, context: any) {
    const {params} =  context;
    //const user = data.filter((x)=> params.user.Id === x.id.toString());

    return  NextResponse.json({
        //user,
        data,
  });
  }
    
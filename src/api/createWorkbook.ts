import got from "got";
import { flatfileRootUrl } from "../constants.js";

const endpoints = {
    workbooks: `${flatfileRootUrl}/workbooks`
}

export const createWorkbook = async (key: string) => {
    return await got.post(endpoints.workbooks, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${key}`
        },
        json: {
            "name": "My First Workbook",
            "sheets": [
                {
                    "name": "Contact",
                    "slug": "contacts",
                    "fields": [
                        {
                            "key": "firstName",
                            "type": "string",
                            "label": "First Name"
                        },
                        {
                            "key": "lastName",
                            "type": "string",
                            "label": "Last Name"
                        },
                        {
                            "key": "email",
                            "type": "string",
                            "label": "Email"
                        }
                    ]
                }
            ],
            "actions": [
                {
                    "operation": "submitAction",
                    "mode": "foreground",
                    "label": "Submit",
                    "description": "Submit data to webhook.site",
                    "primary": true
                }
            ]
        }
    }).json();
}
import { Injectable } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { CloudTasksClient } from "@google-cloud/tasks";

@Injectable()
export class TaskService {
    private client = new CloudTasksClient()
    private project = process.env.GCP_TASKS_PROJECT
    private location = process.env.GCP_TASKS_LOCATION
    private readonly logger = new Logger(TaskService.name);

    async createTask({ payload, queue, url }){
        const parent = this.client.queuePath(this.project, this.location, queue)

        const task: any = {
            httpRequest: {
                httpMethod: 'POST',
                url: process.env.MONIGER_BASE_URL + url,
                headers: { 'Content-Type': 'application/json'},
                body: Buffer.from(JSON.stringify({ payload })).toString('base64')
            }
        }

        try {
            const [response] = await this.client.createTask({ parent, task });
            this.logger.log('Task created:', response.name);
        } catch (error) {
            this.logger.error(error)
        }
    }
}
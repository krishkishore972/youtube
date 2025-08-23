import { Kafka } from "kafkajs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class KafkaConfig {
  constructor(groupId) {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT_ID,
      brokers: [process.env.KAFKA_BROKER],
      ssl: {
        ca: [fs.readFileSync(path.resolve(__dirname, "../ca.pem"), "utf-8")],
      },
      sasl: {
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
        mechanism: "plain",
      },
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId});
    this.producerConnected = false;
  }

  async produce(topic, messages) {
    try {
      if (!this.producerConnected) {
        await this.producer.connect();
        this.producerConnected = true;
      }
      await this.producer.send({
        topic: topic,
        messages: messages,
      });
    } catch (error) {
     console.error("Producer error:", error);
    }
    // finally {
    //   await this.producer.disconnect();
    // }
  }
  async consume(topic, callback) {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({ topic: topic, fromBeginning: true });
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const value = message.value.toString();
          callback(value);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
export default KafkaConfig;

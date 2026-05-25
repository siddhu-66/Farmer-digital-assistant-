import { Server } from "socket.io";
import type { NextApiRequest } from "next";
import { getBackendWeatherUrl } from "@/lib/getBackendOrigin";

export const config = { api: { bodyParser: false } };

const ioHandler = (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
    const weatherUrl = getBackendWeatherUrl("current");

    io.on("connection", (socket) => {
      const sensorInterval = setInterval(() => {
        socket.emit("sensor_update", {
          moisture: 40 + Math.random() * 10,
          temp: 22 + Math.random() * 5,
          npk: { n: 45, p: 30, k: 25 },
          timestamp: new Date().toISOString(),
        });
      }, 5000);

      const weatherInterval = setInterval(async () => {
        try {
          const weatherRes = await fetch(weatherUrl);
          if (!weatherRes.ok) return;
          const weather = await weatherRes.json();
          socket.emit("weather_update", weather);
        } catch (_err) {
          // Weather sync is best-effort; sensor simulation continues
        }
      }, 30000);

      socket.on("disconnect", () => {
        clearInterval(sensorInterval);
        clearInterval(weatherInterval);
      });
    });
  }
  res.end();
};

export default ioHandler;

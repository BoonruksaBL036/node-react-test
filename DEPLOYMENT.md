# แนวทางการ Deploy โปรเจค

เอกสารนี้อธิบายขั้นตอนการ Deploy แอปพลิเคชัน Node.js (Backend) และ React (Frontend)

## สารบัญ

- [ภาพรวม](#ภาพรวม)
- [สิ่งที่ต้องมีก่อน](#สิ่งที่ต้องมีก่อน)
- [การ Deploy Backend (Node.js)](#การ-deploy-backend-nodejs)
- [การ Deploy Frontend (React)](#การ-deploy-frontend-react)
- [การตั้งค่า Web Server (ตัวอย่าง Nginx)](#การตั้งค่า-web-server-ตัวอย่าง-nginx)

---

### ภาพรวม

โปรเจคนี้ประกอบด้วยสองส่วนหลัก:
1.  **Backend**: สร้างด้วย Node.js และ Express ทำหน้าที่เป็น API Server
2.  **Frontend**: สร้างด้วย React เป็นส่วนที่ผู้ใช้โต้ตอบด้วย (User Interface)

ในการ Deploy เราจะต้องทำให้ทั้งสองส่วนนี้ทำงานบน Server และสามารถสื่อสารกันได้

---

### สิ่งที่ต้องมีก่อน

- Server ที่มีสิทธิ์เข้าถึงแบบ Shell (SSH) เช่น VPS บน DigitalOcean, AWS EC2, หรือ Linode
- ติดตั้ง Node.js และ npm บน Server
- ติดตั้ง Git บน Server
- (แนะนำ) ติดตั้ง Web Server เช่น Nginx หรือ Apache
- (แนะนำ) มี Domain Name ที่ต้องการใช้งาน

---

### การ Deploy Backend (Node.js)

1.  **Clone Repository:**
    เชื่อมต่อกับ Server ของคุณผ่าน SSH แล้ว Clone โปรเจคนี้ลงไป:
    ```bash
    git clone <your-repository-url>
    cd node-react-test/backend
    ```

2.  **ติดตั้ง Dependencies:**
    ติดตั้ง library ที่จำเป็นทั้งหมดด้วย npm:
    ```bash
    npm install
    ```

3.  **ตั้งค่า Environment Variables:**
    Backend ต้องการไฟล์ `.env` สำหรับการตั้งค่าค่าตัวแปรต่างๆ เช่น Port, Database connection string, หรือ API keys. ให้สร้างไฟล์ `.env` ขึ้นมาในโฟลเดอร์ `backend`:
    ```bash
    cp .env.example .env
    ```
    จากนั้นแก้ไขค่าในไฟล์ `.env` ให้ถูกต้องตามสภาพแวดล้อมของ Server
    ```
    PORT=5000
    # ตัวแปรอื่นๆ ที่จำเป็น
    ```

4.  **Start Server:**
    ใช้ Process Manager อย่าง PM2 เพื่อช่วยให้แอปพลิเคชันทำงานอยู่ตลอดเวลา (แม้จะออกจาก SSH) และสามารถ Restart อัตโนมัติได้หากเกิดปัญหา

    - **ติดตั้ง PM2 (ถ้ายังไม่มี):**
      ```bash
      npm install pm2 -g
      ```

    - **เริ่มการทำงานของแอปพลิเคชันด้วย PM2:**
      ```bash
      pm2 start server.js --name "my-app-backend"
      ```

    - **ตรวจสอบสถานะ:**
      ```bash
      pm2 list
      ```

    ตอนนี้ Backend API ของคุณควรจะทำงานบน Port ที่กำหนดไว้ในไฟล์ `.env` (เช่น `http://your_server_ip:5000`)

---

### การ Deploy Frontend (React)

Frontend เป็น Static Website ซึ่งหมายความว่าเราต้อง Build โปรเจคให้เป็นไฟล์ HTML, CSS, และ JavaScript บริสุทธิ์ก่อน

1.  **ไปยังโฟลเดอร์ Frontend:**
    จาก Directory หลักของโปรเจค:
    ```bash
    cd ../frontend
    ```

2.  **ติดตั้ง Dependencies:**
    ```bash
    npm install
    ```

3.  **ตั้งค่า Environment Variables:**
    เช่นเดียวกับ Backend, Frontend อาจต้องการไฟล์ `.env` เพื่อกำหนดค่าต่างๆ เช่น URL ของ API Backend
    สร้างไฟล์ `.env` ในโฟลเดอร์ `frontend`:
    ```
    REACT_APP_API_URL=http://your_domain_or_ip/api
    ```
    **สำคัญ:** ตัวแปรใน React ต้องขึ้นต้นด้วย `REACT_APP_`

4.  **Build โปรเจค:**
    รันคำสั่ง Build เพื่อสร้างเวอร์ชันสำหรับ Production:
    ```bash
    npm run build
    ```
    คำสั่งนี้จะสร้างโฟลเดอร์ใหม่ชื่อ `build` ซึ่งบรรจุไฟล์ Static ทั้งหมดที่จำเป็น

5.  **นำไฟล์ไปให้บริการ:**
    ไฟล์ในโฟลเดอร์ `build` คือสิ่งที่เราจะนำไป Deploy เราสามารถให้บริการไฟล์เหล่านี้ได้หลายวิธี เช่น:
    - **ใช้ Web Server (Nginx/Apache):** ตั้งค่าให้ Web Server ชี้มาที่โฟลเดอร์ `frontend/build` (ดูหัวข้อถัดไป)
    - **ใช้บริการ Static Hosting:** อัปโหลดเนื้อหาของโฟลเดอร์ `build` ไปยังบริการอย่าง Netlify, Vercel, หรือ GitHub Pages ซึ่งเป็นวิธีที่ง่ายและรวดเร็ว

---

### การตั้งค่า Web Server (ตัวอย่าง Nginx)

เพื่อทำให้ผู้ใช้สามารถเข้าถึงทั้ง Frontend และ Backend ผ่าน Domain เดียวกัน (เช่น `yourdomain.com` สำหรับ Frontend และ `yourdomain.com/api` สำหรับ Backend) เราสามารถใช้ Nginx เป็น Reverse Proxy ได้

นี่คือตัวอย่างไฟล์ Config ของ Nginx (`/etc/nginx/sites-available/yourdomain`):

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # ชี้ไปยังไฟล์ของ React ที่ Build แล้ว
    root /path/to/your/project/frontend/build;
    index index.html index.htm;

    # สำหรับ React Router
    location / {
        try_files $uri /index.html;
    }

    # Reverse Proxy สำหรับ Backend API
    # ทุก Request ที่มาที่ /api จะถูกส่งต่อไปยัง Node.js Server
    location /api {
        proxy_pass http://localhost:5000; # Port ของ Backend
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**ขั้นตอนการเปิดใช้งาน Nginx Config:**

1.  สร้าง Symbolic Link ไปยัง `sites-enabled`:
    ```bash
    sudo ln -s /etc/nginx/sites-available/yourdomain /etc/nginx/sites-enabled/
    ```
2.  ทดสอบว่า Config ถูกต้องหรือไม่:
    ```bash
    sudo nginx -t
    ```
3.  ถ้าถูกต้อง ให้ Restart Nginx:
    ```bash
    sudo systemctl restart nginx
    ```

ตอนนี้คุณควรจะสามารถเข้าถึง Frontend ได้ที่ `http://yourdomain.com` และ Backend API จะอยู่ที่ `http://yourdomain.com/api`

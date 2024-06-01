const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT;
const DbConnect = require("./dbConfig/ConfigDb");
DbConnect();

const verifyToken = require('./middlewares/authMiddleware');
const onlyAdminAccess = require('./middlewares/adminMiddleware');
const {getAllRoutes} = require('./controllers/admin/routerController')
app.use(express.json());
app.use(express.static('public'));

const authRouter = require('./routes/authRoute');
const adminRouter = require('./routes/adminRoute');
const commonRoute = require('./routes/commonRoute');


app.use('/api',authRouter)
app.use('/api/admin',adminRouter)
app.use('/api',commonRoute)

app.get('/api/admin/all-routes',verifyToken,onlyAdminAccess,getAllRoutes)


app.listen(PORT,()=>{
    console.log(`server connected is port ${PORT}`);
})


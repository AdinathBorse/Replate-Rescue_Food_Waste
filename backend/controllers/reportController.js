import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";

const getReport = async (req, res) => {
    try {
        const { from, to } = req.query;
        const validFrom = !from || (
            typeof from === "string"
            && /^\d{4}-\d{2}-\d{2}$/.test(from)
            && new Date(`${from}T00:00:00Z`).toISOString().slice(0, 10) === from
        );
        const validTo = !to || (
            typeof to === "string"
            && /^\d{4}-\d{2}-\d{2}$/.test(to)
            && new Date(`${to}T00:00:00Z`).toISOString().slice(0, 10) === to
        );
        if (!validFrom || !validTo) {
            return res.json({ success: false, message: "Error" });
        }

        const fromDate = from ? new Date(`${from}T00:00:00+05:30`) : null;
        const toDate = to ? new Date(`${to}T00:00:00+05:30`) : null;
        if (fromDate && toDate && fromDate > toDate) {
            return res.json({ success: false, message: "Error" });
        }

        const orders = await orderModel.find({
            adminId: req.user.userId,
            payment: true,
        });
        const foods = await foodModel.find({ adminId: req.user.userId });
        const foodsById = Object.create(null);
        foods.forEach((food) => {
            foodsById[food._id.toString()] = food;
        });

        const statusCounts = {
            "Food Processing": 0,
            "Out for Delivery": 0,
            Delivered: 0,
        };
        const topItemsById = Object.create(null);
        const categoriesByName = Object.create(null);
        const dailyByDate = Object.create(null);
        let totalSales = 0;
        let itemsSold = 0;
        let bagsSold = 0;
        let mysterySales = 0;
        let savings = 0;
        let totalOrders = 0;

        orders.forEach((order) => {
            const orderDate = order._id.getTimestamp();
            if (
                (fromDate && orderDate < fromDate)
                || (toDate && orderDate >= new Date(toDate.getTime() + 24 * 60 * 60 * 1000))
            ) {
                return;
            }

            totalOrders += 1;
            if (Object.hasOwn(statusCounts, order.status)) {
                statusCounts[order.status] += 1;
            }

            const indiaDate = new Date(orderDate.getTime() + 330 * 60 * 1000)
                .toISOString()
                .slice(0, 10);
            if (!dailyByDate[indiaDate]) {
                dailyByDate[indiaDate] = { date: indiaDate, orders: 0, sales: 0 };
            }
            dailyByDate[indiaDate].orders += 1;

            order.items.forEach((item) => {
                const quantity = Number(item.quantity) || 0;
                const price = Number(item.price) || 0;
                const sales = price * quantity;
                const foodId = item._id?.toString();
                const food = foodId ? foodsById[foodId] : null;
                const itemKey = foodId || item.name;
                const category = food ? food.category : "Other";

                totalSales += sales;
                itemsSold += quantity;
                dailyByDate[indiaDate].sales += sales;

                if (!topItemsById[itemKey]) {
                    topItemsById[itemKey] = { name: item.name, quantity: 0, sales: 0 };
                }
                topItemsById[itemKey].quantity += quantity;
                topItemsById[itemKey].sales += sales;

                if (!categoriesByName[category]) {
                    categoriesByName[category] = { category, quantity: 0, sales: 0 };
                }
                categoriesByName[category].quantity += quantity;
                categoriesByName[category].sales += sales;

                if (food?.isMysteryBag) {
                    bagsSold += quantity;
                    mysterySales += sales;
                    savings += (Number(food.originalPrice) - Number(food.price)) * quantity;
                }
            });
        });

        const topItems = Object.values(topItemsById)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5);
        const byCategory = Object.values(categoriesByName)
            .sort((a, b) => a.category.localeCompare(b.category));
        const daily = Object.values(dailyByDate)
            .sort((a, b) => a.date.localeCompare(b.date));

        return res.json({
            success: true,
            data: {
                summary: {
                    totalOrders,
                    totalSales,
                    itemsSold,
                    avgOrderValue: totalOrders ? totalSales / totalOrders : 0,
                },
                byStatus: statusCounts,
                topItems,
                byCategory,
                mystery: { bagsSold, sales: mysterySales, savings },
                daily,
            },
        });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Error" });
    }
};

export { getReport };

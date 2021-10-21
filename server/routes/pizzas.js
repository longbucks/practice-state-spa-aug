const { Router } = require("express");
const router = Router();
const pizza = require("../models/Pizzas");

// Create record in MongoDB
router.post("/", (request, response) => {
  const newPizza = new pizza.model(request.body);
  newPizza.save((err, pizza) => {
    // return err ? response.sendStatus(500).json(err) : response.json(pizza);\
    if (err) {
      return response.sendStatus(500).json(err);
    } else {
      return response.json(pizza);
    }
  });
});
router.get("/", (req, res) => {
  pizza.model.find({}, (error, data) => {
    if (error) return res.sendStatus(500).json(error);
    return res.json(data);
  });
});
// get a pizza by id
router.get("/:id", (req, res) => {
  pizza.model.findById(req.params.id, (error, data) => {
    if (error) return res.sendStatus(500).json(error);
    return res.json(data);
  });
});

// Delete a pizza by id
router.delete("/:id", (req, res) => {
  pizza.model.findByIdAndRemove(req.params.id, {}, (error, data) => {
    if (error) return res.sendStatus.apply(500).json(error);
    return res.json(data);
  });
});

router.put("/:id", (req, res) => {
  const body = req.body;
  pizza.model.findOneAndUpdate(
    req.params.id,
    {
      $set: {
        crust: body.crust,
        cheese: body.cheese,
        sauce: body.sauce,
        toppings: body.toppings
      }
    },
    error => {
      if (error) return res.sendStatus(500).json(error);
      return res.json(req.body);
    }
  );
});

module.exports = router;

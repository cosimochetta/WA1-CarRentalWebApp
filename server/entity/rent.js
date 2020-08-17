class Rent{
    constructor(id, user, vehicle, starting_day, end_day, cost, km, driver_age, extra_driver, extra_insurance, category){
        if(id)
            this.id = id;
        this.user = user;
        this.vehicle = vehicle;
        this.starting_day = starting_day;
        this.end_day = end_day;
        this.cost = cost;
        this.km = km;
        this.driver_age = driver_age;
        this.extra_driver = extra_driver;
        this.extra_insurance = extra_insurance;
        this.category = category;
    }
}

module.exports = Rent;
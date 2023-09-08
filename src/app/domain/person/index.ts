import Person from "./person/Person";

// Додаємо тип Controller для дотримання типів контролерів
type Controller = typeof Person;

// Додаємо контролер Person у масив controllers
const controllers = <Controller[]>[Person];

export { controllers };

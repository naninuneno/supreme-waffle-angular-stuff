import {InMemoryDbService} from 'angular-in-memory-web-api';
import {Hero} from './hero';

export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    // 'api/heroes' request will be intercepted and return this
    const heroes = [
      {id: 11, name: 'Mr. Nice'},
      {id: 12, name: 'Narco'},
      {id: 13, name: 'Bombasto'},
      {id: 14, name: 'Celeritas'},
      {id: 15, name: 'Magneta'},
      {id: 16, name: 'RubberMan'},
      {id: 17, name: 'Dynama'},
      {id: 18, name: 'Dr IQ'},
      {id: 19, name: 'Magma'},
      {id: 20, name: 'Tornado'}
    ];

    const realHeroes = [
      {id: 11, name: 'Richter'},
      {id: 12, name: 'Simon'},
      {id: 13, name: 'Julius'},
      {id: 14, name: 'Leon'},
      {id: 15, name: 'Alucard'},
    ];
    return {heroes, realHeroes};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(heroes: Hero[]): number {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 11;
  }
}

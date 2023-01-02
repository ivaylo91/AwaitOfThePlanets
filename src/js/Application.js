import EventEmitter from "eventemitter3";
import image from "../images/planet.svg";

export default class Application extends EventEmitter {
    static get events() {
        return {
            READY: "ready",
        };
    }

    constructor() {
        super();
        this._loading = document.querySelector("progress");
        this._startLoading();

        this.arr = [];
        this.emit(Application.events.READY);
    }


    async _load(){
        let url = "https://swapi.boom.dev/api/planets/";

        let res = await fetch(url);
        let planets = await res.json();
        let next = planets.next;
        this.arr = [...this.arr, ...planets.results];
        while(next) {
            res = await fetch(next);
            planets = await res.json();
            next = planets.next;
            this.arr = [...this.arr, ...planets.results];
        }

        this.arr.forEach((planet) => {
            this._create(planet.name, planet.terrain, planet.population)
        });

        this._stopLoading();
    }


    _create(name, terrain, population) {
        const planet = document.createElement('div');
        planet.classList.add('box');
        planet.innerHTML = this._render({
            name: name,
            terrain: terrain,
            population: population,
        })
        document.body.querySelector('.main').appendChild(planet);
    }

    async _startLoading() {
        await this._load();
    }

    _stopLoading() {
        this._loading.style.display = 'none';
    }

    _render({ name, terrain, population }) {
        return `
<article class="media">
  <div class="media-left">
    <figure class="image is-64x64">
      <img src="${image}" alt="planet">
    </figure>
  </div>
  <div class="media-content">
    <div class="content">
    <h4>${name}</h4>
      <p>
        <span class="tag">${terrain}</span> <span class="tag">${population}</span>
        <br>
      </p>
    </div>
  </div>
</article>
    `;
    }
}

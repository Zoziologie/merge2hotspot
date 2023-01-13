<script setup>
import { MapboxMap, MapboxMarker, MapboxCluster, MapboxPopup } from "@studiometa/vue-mapbox-gl";
import { ref, nextTick } from "vue";
import "mapbox-gl/dist/mapbox-gl.css";
import * as bootstrap from "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
//import iucn_CR from "./assets/iucn_CR.png"
</script>

<template>
  <div class="container-fluid h-100 d-flex flex-column p-0">
    <div class="row flex-grow-1 gx-0">
      <div class="col-md-4 vh-100 d-flex flex-column">
        <div class="row mx-2 my-1">
          <div class="col"><h3>Merge2Hotspot</h3></div>
          <div class="col text-end align-middle">
            <a
              type="button"
              class="btn btn-outline-secondary btn-sm align-middle me-2"
              href="https://github.com/Zoziologie/merge2hotspot"
            >
              <i class="bi bi-github"></i>
            </a>
            <button
              type="button"
              class="btn btn-primary btn-sm align-middle"
              data-bs-toggle="modal"
              data-bs-target="#modalInformation"
            >
              <i class="bi bi-info-circle"></i>
            </button>
          </div>
        </div>

        <!-- Nav tabs -->
        <ul class="nav nav-tabs nav-fill px-1" id="mainTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="import-tab"
              data-bs-toggle="tab"
              data-bs-target="#import"
              type="button"
              role="tab"
              aria-controls="import"
              aria-selected="false"
            >
              1. Import
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              :class="{ disabled: step < 2 }"
              :aria-disabled="step < 2"
              id="hotspot-tab"
              data-bs-toggle="tab"
              data-bs-target="#hotspot"
              type="button"
              role="tab"
              aria-controls="hotspot"
              aria-selected="false"
            >
              2. Hotspot
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              :class="{
                disabled: step < 3,
              }"
              :aria-disabled="step < 3"
              id="merge-tab"
              data-bs-toggle="tab"
              data-bs-target="#merge"
              type="button"
              role="tab"
              aria-controls="merge"
              aria-selected="false"
            >
              3. Merge
            </button>
          </li>
        </ul>

        <!-- Tab panes -->
        <div class="tab-content flex-grow-1 overflow-auto">
          <div
            class="tab-pane px-3 py-3 active"
            id="import"
            role="tabpanel"
            aria-labelledby="import-tab"
          >
            <p>
              Import your eBird data (<code>MyEBirdData.csv</code>), which you can
              <a href="https://ebird.org/downloadMyData" target="_blank">
                request from the eBird website </a
              >:
            </p>
            <label class="w-100 mb-3">
              <input
                type="file"
                class="form-control"
                accept=".csv"
                @change="processMyeBirdDataFile"
              />
              <span class="custom-file-control"></span>
            </label>
            <div v-if="loadingMyeBirdDataStatus == 0">
              <div class="alert alert-warning d-flex align-items-center" role="alert">
                <div
                  class="spinner-border me-2 spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></div>
                <strong class="me-1">Loading data.</strong> This might take up to a minute...
              </div>
            </div>
            <div v-else-if="loadingMyeBirdDataStatus == 1">
              <div class="alert alert-success" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>
                <strong>Data loaded successfully! </strong>
                {{ formatNb(myLocation.reduce((b, e) => b + e.subId.length, 0)) }}
                checklists over {{ formatNb(myLocation.length) }} locations.
                <br />
                Move to the next tab to download hotspot information
                <button
                  type="button"
                  class="btn btn-sm btn-outline-primary my-1"
                  @click="navTabActivate('hotspot')"
                >
                  2. Hotspot
                </button>
              </div>
            </div>
            <div v-else-if="loadingMyeBirdDataStatus == -1">
              <div class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>There is an error! </strong>
                Please check that the file uploaded is the raw
                <code>MyEBirdData.csv</code> downloaded from
                <a href="https://ebird.org/downloadMyData" target="_blank">eBird.org</a>. If the
                error persists, please contact me at
                <a href="mailto:rafnuss@gmail.com">rafnuss@gmail.com</a> with your file.
                <br />
              </div>
            </div>
          </div>
          <div
            class="tab-pane px-3 py-3"
            id="hotspot"
            role="tabpanel"
            aria-labelledby="hotspot-tab"
          >
            <p>Then, load the existing eBird hotspots for the regions you want to check.</p>
            <div class="alert alert-success" role="alert" v-if="step == 3">
              <i class="bi bi-check-circle-fill me-2"></i>
              <strong>Hotspots loaded successfully! </strong>
              Select more region(s) or move to the final step
              <button
                type="button"
                class="btn btn-sm btn-outline-primary my-1"
                @click="navTabActivate('merge')"
              >
                <small>3. Merge</small>
              </button>
            </div>
            <ul class="list-group">
              <li
                v-for="r in region.filter((e) => e.subIdNb > 0)"
                :key="r.code"
                class="list-group-item d-flex justify-content-between align-items-start px-1 py-1"
              >
                <div class="ms-2 me-auto">
                  <span class="fw-bold">
                    {{ r.name }}
                  </span>
                  <span v-if="r.status != 'downloaded'" class="badge bg-secondary pill ms-2"
                    >{{ formatNb(r.locIdNb) }}
                    <i class="bi bi-pin"></i>
                  </span>
                  <span v-if="r.status == 'downloaded'" class="badge bg-danger pill ms-2"
                    >{{ formatNb(r.locIdNb - r.locPerNb) }}
                    <i class="bi bi-pin"></i>
                  </span>
                  <span v-if="r.status == 'downloaded'" class="badge bg-primary pill ms-2"
                    >{{ formatNb(r.locPerNb) }}
                    <i class="bi bi-pin"></i>
                  </span>
                  <a :href="'https://ebird.org/mychecklists/' + r.code" target="_blank">
                    <span class="badge bg-primary pill ms-2"
                      >{{ formatNb(r.subIdNb) }}
                      <i class="bi bi-card-checklist"></i>
                    </span>
                  </a>
                </div>
                <button
                  class="btn btn-outline-primary btn-sm"
                  v-if="r.status == null"
                  @click="downloadRegion(r)"
                >
                  <i class="bi bi-download"></i>
                </button>
                <button v-else-if="r.status == 'loading'" class="btn btn-warning btn-sm">
                  <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </button>
                <button v-else-if="r.status == 'downloaded'" class="btn btn-success btn-sm">
                  <i class="bi bi-check-circle"></i>
                </button>
              </li>
            </ul>
          </div>
          <div class="tab-pane px-3 py-3" id="merge" role="tabpanel" aria-labelledby="merge-tab">
            <p>
              Browse the map or use the list below to find the locations you wish to merge or edit.
              You can also rename or suggest it as eBird hotspot.
            </p>
            <div class="btn-group mb-2" role="group">
              <input
                type="radio"
                class="btn-check"
                name="btnradio"
                id="btnradio1"
                autocomplete="off"
                v-model="filterList"
                value="time"
                checked
              />
              <label class="btn btn-sm btn-outline-primary" for="btnradio1"
                >Latest checklists</label
              >

              <input
                type="radio"
                class="btn-check"
                name="btnradio"
                id="btnradio2"
                autocomplete="off"
                v-model="filterList"
                value="distance"
              />
              <label class="btn btn-sm btn-outline-primary" for="btnradio2"
                >Distance to hotspot</label
              >

              <input
                type="radio"
                class="btn-check"
                name="btnradio"
                id="btnradio3"
                autocomplete="off"
                v-model="filterList"
                value="number"
              />
              <label class="btn btn-sm btn-outline-primary" for="btnradio3"
                >Number of checklists</label
              >
            </div>
            <div class="list-group">
              <a
                href="#"
                v-for="m in myPersonalLocationSorted"
                :key="m.locId"
                class="list-group-item d-flex justify-content-between align-items-start px-1 py-1 list-group-item-action"
                @click="map.flyTo({ center: [m.lng, m.lat], zoom: 14 })"
              >
                <div class="ms-2 me-auto">
                  {{ m.locname }}
                  <small
                    ><span class="fw-bold"> {{ m.region }} </span></small
                  >
                  <a :href="'https://ebird.org/mychecklists/' + m.locId" target="_blank">
                    <span class="badge bg-primary pill ms-2"
                      >{{ formatNb(m.subIdNb) }}
                      <i class="bi bi-card-checklist"></i>
                    </span>
                  </a>
                  <span class="badge bg-secondary pill ms-2">
                    <i class="bi bi-pin-map-fill"></i> {{ Math.round(m.closestHotspot.dist) }} km
                  </span>
                  <a
                    :href="'https://ebird.org/mylocations/edit/' + m.locId"
                    target="_blank"
                    class="btn btn-sm btn-outline-primary align-self-center ms-2 py-0"
                  >
                    Edit location
                  </a>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="col flex-grow-1" @shown="reloadMap()">
        <MapboxMap
          map-style="mapbox://styles/mapbox/streets-v11"
          class="h-100"
          :center="[0, 0]"
          :zoom="1"
          access-token="pk.eyJ1IjoicmFmbnVzcyIsImEiOiIzMVE1dnc0In0.3FNMKIlQ_afYktqki-6m0g"
          @mb-created="(mapInstance) => (map = mapInstance)"
        >
          <MapboxPopup
            v-if="popupIsOpen"
            :key="popupPosition.join('-')"
            :lng-lat="popupPosition"
            anchor="bottom"
            @mb-close="() => (popupIsOpen = false)"
          >
            <div class="d-flex align-self-center justify-content-between my-2">
              <div class="d-inline">
                <a :href="'https://ebird.org/hotspot/' + popupLoc.locId" target="_blank">
                  <strong>{{ popupLoc.locName }}</strong></a
                >
                <span class="align-self-center badge bg-secondary pill py-1 ms-2"
                  >{{ formatNb(popupLoc.numSpeciesAllTime) }}
                  <i class="bi bi-binoculars-fill"></i>
                </span>
              </div>
            </div>
          </MapboxPopup>
          <MapboxCluster
            v-if="hotspot.length > 0"
            :data="hotspotGeojson"
            :clusterRadius="30"
            :clustersPaint="{
              'circle-color': '#dc3545',
              'circle-radius': 20,
            }"
            :unclusteredPointPaint="{ 'circle-color': '#dc3545', 'circle-radius': 10 }"
            @mb-feature-click="openPopup"
          />
          <MapboxCluster
            v-else-if="myLocation.length > 0"
            :data="myLocationGeojson"
            :clusterRadius="30"
            :clustersPaint="{
              'circle-color': '#858585',
              'circle-radius': 20,
            }"
            :unclusteredPointPaint="{ 'circle-color': '#858585', 'circle-radius': 10 }"
            @mb-feature-click="openPopup"
          />
          <MapboxMarker
            v-for="m in myPersonalLocation"
            :key="m.locId"
            :lng-lat="[m.lng, m.lat]"
            popup
          >
            <template v-slot:popup>
              <div class="d-inline">
                <a :href="'https://ebird.org/hotspot/' + popupLoc.locId" target="_blank">
                  <h6>{{ m.locname }}</h6></a
                >
                <a :href="'https://ebird.org/mychecklists/' + m.locId" target="_blank">
                  <span class="badge bg-primary pill ms-2"
                    >{{ formatNb(m.subIdNb) }}
                    <i class="bi bi-card-checklist"></i>
                  </span>
                </a>
                <span class="badge bg-secondary pill ms-2">
                  <i class="bi bi-pin-map-fill"></i> {{ Math.round(m.closestHotspot.dist) }} km
                </span>
                <a
                  :href="'https://ebird.org/mylocations/edit/' + m.locId"
                  target="_blank"
                  class="btn btn-sm btn-outline-primary align-self-center ms-2"
                >
                  Edit location
                </a>
              </div>
            </template>
          </MapboxMarker>
        </MapboxMap>
      </div>
    </div>
  </div>
  <div
    class="modal fade modal-lg"
    id="modalInformation"
    tabindex="-1"
    aria-labelledby="modalInformationLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="modalInformationLabel">Information</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h5>Introduction</h5>
          <p>
            This app helps you find your checklists for which the associated location is not an
            eBird hotspot (i.e. personal location) and suggests nearby hotspots. A link to to merge
            your personal location to the hotspot will be provided.
          </p>
          <p>
            Assigning a hotspot to your data is essential for data analysis. For instance, you can
            then compute the probability of observation of each specie for a given hotspot and
            <a href="https://zoziologie.raphaelnussbaumer.com/ebird2latex/" traget="_blank"
              >generate a checklist</a
            >. Step by step instructions are given below.
          </p>
          <h5>Step 1: Import</h5>
          <p>The first step is to download all your eBird data on your computer.</p>
          <a
            role="button"
            class="btn btn-primary mb-3 w-100"
            href="https://ebird.org/downloadMyData"
            target="_blank"
          >
            Download your eBird file
          </a>
          <p>
            Import your <code>MyEBirdData.csv</code> using the upload file below. Note this the file
            is never sent to our server, only used in your browser.
          </p>
          <h5>Step 2: Hotspot</h5>
          <p>
            You can now see all your birded locations with the number of checklists (icon value).
          </p>
          <p>
            From these locations, we listed below the different countries/regions you've been
            birding. The blue badges
            <span class="badge bg-primary rounded-pill" style="float: inherit">25</span>
            indicate the number of locations birded in this particular region.
          </p>
          <p>
            Click on the download icon
            <button class="btn btn-outline-primary btn-sm">
              <i class="bi bi-download"></i>
            </button>
            to download all eBird hotspots for this region. We recommend this you download regions
            rather than countries when possible.
          </p>
          <p>
            Once you are done, click on the button "Find locations without hotspot" below the list.
          </p>
          <h5>Step 3: Merge</h5>
          <p>
            Locations without hotspots are listed in the table below and sorted by distance to the
            nearest hotspot (right column). Click on each table row to view this location on the
            map.
          </p>
          <p>
            If you would like to merge the location with an hotspot or suggest the location as a
            hotpost, click on
            <i class="fas fa-edit"></i>.
          </p>
          <p>
            Last tip, you can display/hide the eBird hotspots by toggling the checkbox of the layer
            on the top-right corner of your screen. Sometimes your personal location marker is
            hidden behind a hotspot marker.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      map: null,
      popupIsOpen: false,
      popupPosition: [0, 0],
      popupLoc: {},
      myLocation: [],
      loadingMyeBirdDataStatus: null,
      hotspot: [],
      region: [],
      filterList: "distance",
    };
  },
  methods: {
    formatNb(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    processMyeBirdDataFile(event) {
      this.loadingMyeBirdDataStatus = 0;
      const reader = new FileReader();
      reader.onload = (e) => {
        const str = e.target.result;

        const delimiter = ",";
        // slice from start of text to the first \n index use split to create an array from string by delimiter
        const headersExisting = str.slice(0, str.indexOf("\n")).split(delimiter);

        // Define list of header to be used
        const headers = [
          "Submission ID",
          "Location ID",
          "Location",
          "Longitude",
          "Latitude",
          "Date",
          "State/Province",
        ];
        const headersName = ["subId", "locId", "locname", "lng", "lat", "date", "region"];

        // Find the index of the header and check that the csv is valid
        const headersIndex = headers.map((e) => {
          const ind = headersExisting.indexOf(e);
          if (ind === -1) {
            this.loadingMyeBirdDataStatus = -1;
            throw new TypeError("CSV file not valid. It does not contains the header: " + e);
          }
          return ind;
        });

        // slice from \n index + 1 to the end of the text use split to create an array of each csv value row
        const rows = str.slice(str.indexOf("\n") + 1).split("\n");

        //
        const myEBirdData = rows.map(function (row) {
          const values = row.split(delimiter);
          const el = headers.reduce(function (object, header, index) {
            object[headersName[index]] = values[headersIndex[index]];
            return object;
          }, {});
          return el;
        });

        // Get unique checklist level data
        const myChecklist = [
          ...new Map(myEBirdData.map((item) => [item.subId, item])).values(),
        ].filter((e) => !isNaN(e.lat) & !isNaN(e.lng));

        this.myLocation = Array.from(new Set(myChecklist.map((s) => s.locId))).map((locId) => {
          const datalocId = myChecklist.filter((s) => s.locId === locId);
          let region = datalocId[0].region.split("-")[0];
          region = (region == "US") | (region == "CA") ? datalocId[0].region : region;
          return {
            locId: locId,
            locname: datalocId[0].locname,
            lng: parseFloat(datalocId[0].lng),
            lat: parseFloat(datalocId[0].lat),
            subId: datalocId.map((e) => e.subId),
            date_last: new Date(Math.max(...datalocId.map((e) => new Date(e.date)))),
            region: region,
          };
        });

        this.loadingMyeBirdDataStatus = 1;

        // Add number of location and checklist in region
        this.region.forEach((r) => {
          const l = this.myLocation.filter((s) => s.region == r.code);
          r.subIdNb = l.reduce((b, e) => b + e.subId.length, 0);
          r.locIdNb = l.length;
        });

        // Fit map view to data
        this.fitMap(this.myLocation);
      };
      reader.onerror = function (error) {
        console.log(error);
        this.loadingMyeBirdDataStatus = -1;
      };
      reader.readAsText(event.target.files[0]);
    },
    navTabActivate(label) {
      new bootstrap.Tab(document.querySelector("#mainTab .nav-item #" + label + "-tab")).show();
    },
    downloadRegion(region) {
      region.status = "loading";
      //let self = this;
      fetch(
        "https://ebird.org/ws2.0/ref/hotspot/" + region.code + "?fmt=json&key=vcs68p4j67pt"
      ).then((response) => {
        response.data.Latitude = parseFloat(response.data.Latitude);
        response.data.Longitude = parseFloat(response.data.Longitude);
        this.hotspot = [...new Set([...this.hotspot, ...response.data])];
        region.status = "downloaded";

        const locId = response.data.map((d) => d.locId);
        region.locPerNb = this.myLocation.filter(
          (s) => (region.code == s.region) & !locId.includes(s.locId)
        ).length;

        this.fitMap(this.hotspot);
      });
    },
    fitMap(l) {
      // Fit map view to data
      this.map.fitBounds(
        l.reduce(
          (p, e) => [
            [Math.min(p[0][0], e.lng), Math.min(p[0][1], e.lat)],
            [Math.max(p[1][0], e.lng), Math.max(p[1][1], e.lat)],
          ],
          [
            [180, 90],
            [-180, -90],
          ]
        )
      );
    },
    distance(lat1, lon1, lat2, lon2) {
      const radlat1 = (Math.PI * lat1) / 180;
      const radlat2 = (Math.PI * lat2) / 180;
      const dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos((Math.PI * (lon1 - lon2)) / 180);
      return ((Math.acos(Math.min(dist, 1)) * 180) / Math.PI) * 60 * 1.1515 * 1.609344;
    },
    async openPopup({ geometry, properties }) {
      await nextTick();
      this.popupPosition = [...geometry.coordinates];
      this.popupIsOpen = true;
      this.popupLoc = properties;
    },
  },
  computed: {
    step() {
      return 1 + (this.myLocation.length > 0) + (this.hotspot.length > 0);
    },
    myPersonalLocation() {
      // Filter non-hotspot location from the region
      const locId = this.hotspot.map((d) => d.locId);
      const reg = this.region.filter((r) => r.status == "downloaded").map((r) => r.code);

      return this.myLocation
        .filter((s) => reg.includes(s.region) & !locId.includes(s.locId))
        .map((s) => {
          s.subIdNb = s.subId.length;
          const tmp = this.hotspot.reduce(
            (acc, h) => {
              const d = this.distance(s.lat, s.lng, h.lat, h.lng);
              return acc[0] > d ? [d, h] : acc;
            },
            [100000, undefined]
          );
          tmp[1].dist = tmp[0];
          s.closestHotspot = tmp[1];
          return s;
        });
    },
    myPersonalLocationSorted() {
      if (this.filterList == "time") {
        return this.myPersonalLocation.sort((a, b) => {
          return b.date_last - a.date_last;
        });
      } else if (this.filterList == "number") {
        return this.myPersonalLocation.sort((a, b) => {
          return b.subId.length - a.subId.length;
        });
      } else if (this.filterList == "distance") {
        return this.myPersonalLocation.sort((a, b) => {
          return a.closestHotspot.dist - b.closestHotspot.dist;
        });
      }
    },
    myLocationGeojson() {
      return {
        type: "FeatureCollection",
        features: this.myLocation.map((e) => {
          return {
            type: "Feature",
            properties: e,
            geometry: {
              coordinates: [e.lng, e.lat, 0],
              type: "Point",
            },
          };
        }),
      };
    },
    myPersonalLocationGeojson() {
      return {
        type: "FeatureCollection",
        features: this.myPersonalLocation.map((e) => {
          return {
            type: "Feature",
            properties: e,
            geometry: {
              coordinates: [e.lng, e.lat, 0],
              type: "Point",
            },
          };
        }),
      };
    },
    hotspotGeojson() {
      return {
        type: "FeatureCollection",
        features: this.hotspot.map((e) => {
          return {
            type: "Feature",
            properties: e,
            geometry: {
              coordinates: [e.lng, e.lat, 0],
              type: "Point",
            },
          };
        }),
      };
    },
  },
  mounted() {
    fetch("https://api.ebird.org/v2/ref/region/list/country/world?key=vcs68p4j67pt").then(
      (response) => {
        response.data = response.data.filter(function (obj) {
          return !["US", "CA"].includes(obj.code);
        });
        this.region = [...this.region, ...response.data];
        fetch("https://api.ebird.org/v2/ref/region/list/subnational1/US?key=vcs68p4j67pt").then(
          (response) => {
            this.region = [...this.region, ...response.data];
            fetch("https://api.ebird.org/v2/ref/region/list/subnational1/CA?key=vcs68p4j67pt").then(
              (response) => {
                this.region = [...this.region, ...response.data]
                  .sort((a, b) => (a.name > b.name ? 1 : -1))
                  .map((e) => {
                    e.status = null;
                    return e;
                  });
              }
            );
          }
        );
      }
    );
  },
};
</script>

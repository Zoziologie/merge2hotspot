<script setup>
import {
  MapboxMap,
  MapboxMarker,
  MapboxCluster,
} from "@studiometa/vue-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "axios";
import * as bootstrap from "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

//import iucn_CR from "./assets/iucn_CR.png"
</script>

<template>
  <div class="container-fluid h-100 d-flex flex-column p-0">
    <div class="row flex-grow-1 gx-0">
      <div class="col-md-4 vh-100 d-flex flex-column" v-if="showSidebar">
        <h3 class="mx-auto">Merge2Hotspot</h3>
        <!-- Nav tabs -->
        <ul class="nav nav-tabs nav-fill" id="mainTab" role="tablist">
          <li class="nav-item" role="presentation">
            <button
              class="nav-link active"
              id="introduction-tab"
              data-bs-toggle="tab"
              data-bs-target="#introduction"
              type="button"
              role="tab"
              aria-controls="introduction"
              aria-selected="true"
            >
              1. Introduction
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              id="import-tab"
              data-bs-toggle="tab"
              data-bs-target="#import"
              type="button"
              role="tab"
              aria-controls="import"
              aria-selected="false"
            >
              2. Import
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              :class="{ disabled: myEBirdData.length == 0 }"
              :aria-disabled="myEBirdData.length > 0"
              id="hotspot-tab"
              data-bs-toggle="tab"
              data-bs-target="#hotspot"
              type="button"
              role="tab"
              aria-controls="hotspot"
              aria-selected="false"
            >
              3. Hotspot
            </button>
          </li>
          <li class="nav-item" role="presentation">
            <button
              class="nav-link"
              :class="{
                disabled: (myEBirdData.length == 0) | (hotspot.length == 0),
              }"
              :aria-disabled="myEBirdData.length > 0"
              id="merge-tab"
              data-bs-toggle="tab"
              data-bs-target="#merge"
              type="button"
              role="tab"
              aria-controls="merge"
              aria-selected="false"
            >
              4. Merge
            </button>
          </li>
        </ul>

        <!-- Tab panes -->
        <div class="tab-content overflow-auto">
          <div
            class="tab-pane active px-3 py-3"
            id="introduction"
            role="tabpanel"
            aria-labelledby="introduction-tab"
          >
            <h4>How does it work?</h4>
            <p>
              This app helps you find your checklists for which the associated
              location is not an eBird hotspot (i.e. personal location) and
              suggests nearby hotspots. A link to to merge your personal
              location to the hotspot will be provided.
            </p>
            <p>
              Assigning a hotspot to your data is essential for data analysis.
              For instance, you can then compute the probability of observation
              of each specie for a given hotspot and
              <a
                href="https://zoziologie.raphaelnussbaumer.com/ebird2latex/"
                traget="_blank"
                >generate a checklist</a
              >. Step by step instructions are given below.
            </p>
            <div class="d-grid gap-2 col-6 mx-auto">
              <button
                type="button"
                class="btn btn-primary"
                @click="navTabActivate('import')"
              >
                Next
              </button>
            </div>
          </div>
          <div
            class="tab-pane px-3 py-3"
            id="import"
            role="tabpanel"
            aria-labelledby="import-tab"
          >
            <h4>Generate your eBird File</h4>
            <p>
              The first step is to download all your eBird data on your
              computer.
            </p>
            <a
              role="button"
              class="btn btn-primary mb-3 w-100"
              href="https://ebird.org/downloadMyData"
              target="_blank"
            >
              Download your eBird file
            </a>
            <h4>Import your eBird File</h4>
            <p>
              Import your <code>MyEBirdData.csv</code> using the upload file
              below. Note this the file is never sent to our server, only used
              in your browser.
            </p>
            <label class="w-100 mb-3">
              <!--class="custom-file"<input type="file" id="uploadMyEBirdData" class="custom-file-input" accept=".csv">-->
              <input
                type="file"
                id="uploadMyEBirdData"
                class="form-control"
                accept=".csv"
                @change="processFile"
              />
              <span class="custom-file-control"></span>
            </label>
            <div v-if="loadingData">
              <div
                class="alert alert-warning d-flex align-items-center"
                role="alert"
              >
                <div
                  class="spinner-border me-2 spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></div>
                <strong class="me-1">Loading data.</strong> This might take up
                to a minute...
              </div>
            </div>
            <div v-else-if="(myEBirdData.length > 0) & (myLocation.length > 0)">
              <div class="alert alert-success" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>
                <strong>Data loaded successfuly! </strong>
                {{ formatNb(myEBirdData.length) }} checklists over
                {{ formatNb(myLocation.length) }} locations.
                <br />
              </div>
              <div class="d-grid gap-2 col-6 mx-auto">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="navTabActivate('hotspot')"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          <div
            class="tab-pane px-3 py-3"
            id="hotspot"
            role="tabpanel"
            aria-labelledby="hotspot-tab"
          >
            <h4>Download eBird hotspots</h4>
            <div class="card mb-2">
              <h6 class="card-header">
                <a
                  data-bs-toggle="collapse"
                  href="#instruction1"
                  aria-expanded="true"
                  aria-controls="instruction1"
                  class="d-block text-decoration-none"
                  id="instruction1-heading"
                >
                  <i class="bi bi-info-circle-fill"></i> Instruction
                </a>
              </h6>
              <div
                id="instruction1"
                class="collapse"
                aria-labelledby="instruction1-heading"
              >
                <div class="card-body">
                  <p>
                    You can now see all your birded locations with the number of
                    checklists (icon value).
                  </p>
                  <p>
                    From these locations, we listed below the different
                    countries/regions you've been birding. The blue badges
                    <span
                      class="badge bg-primary rounded-pill"
                      style="float: inherit"
                      >25</span
                    >
                    indicate the number of locations birded in this particular
                    region.
                  </p>
                  <p>
                    Click on the download icon
                    <button class="btn btn-outline-primary btn-sm">
                      <i class="bi bi-download"></i>
                    </button>
                    to download all eBird hotspots for this region. We recommend
                    this you download regions rather than countries when
                    possible.
                  </p>
                  <p>
                    Once you are done, click on the button "Find locations
                    without hotspot" below the list.
                  </p>
                </div>
              </div>
            </div>
            <ul class="list-group">
              <li
                v-for="r in region.filter((e) => e.subidnb > 0)"
                :key="r.code"
                class="list-group-item d-flex justify-content-between align-items-start px-1 py-1"
              >
                <div class="ms-2 me-auto">
                  <span class="fw-bold me-2">
                    {{ r.name }}
                  </span>
                  <span class="badge bg-primary rounded-pill">{{
                    formatNb(r.subidnb)
                  }}</span>
                </div>
                <button
                  class="btn btn-outline-primary btn-sm"
                  :class="{ disabled: r.status != null }"
                  @click="downloadRegion(r)"
                >
                  <i v-if="r.status == null" class="bi bi-download"></i>
                  <div
                    v-else-if="r.status == 'loading'"
                    class="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span class="visually-hidden">Loading...</span>
                  </div>
                  <i
                    v-else-if="r.status == 'downloaded'"
                    class="bi bi-check-circle"
                  ></i>
                </button>
              </li>
            </ul>
            <div class="d-grid gap-2 col-6 mx-auto">
              <button
                type="button"
                class="btn btn-primary"
                @click="navTabActivate('merge')"
              >
                Next
              </button>
            </div>
          </div>
          <div
            class="tab-pane px-3 py-3"
            id="merge"
            role="tabpanel"
            aria-labelledby="merge-tab"
          >
            <h4>Merge personal locations</h4>
            <div class="card mb-2">
              <h6 class="card-header">
                <a
                  data-bs-toggle="collapse"
                  href="#instruction2"
                  aria-expanded="true"
                  aria-controls="instruction2"
                  class="d-block text-decoration-none"
                  id="instruction2-heading"
                >
                  <i class="bi bi-info-circle-fill"></i> Instruction
                </a>
              </h6>
              <div
                id="instruction2"
                class="collapse"
                aria-labelledby="instruction2-heading"
              >
                <div class="card-body">
                  <p>
                    Locations without hotspots are listed in the table below and
                    sorted by distance to the nearest hotspot (right column).
                    Click on each table row to view this location on the map.
                  </p>
                  <p>
                    If you would like to merge the location with an hotspot or
                    suggest the location as a hotpost, click on
                    <i class="fas fa-edit"></i>.
                  </p>
                  <p>
                    Last tip, you can display/hide the eBird hotspots by
                    toggling the checkbox of the layer on the top-right corner
                    of your screen. Sometimes your personal location marker is
                    hidden behind a hotspot marker.
                  </p>
                </div>
              </div>
            </div>
            <div class="d-grid gap-2 col-6 mx-auto">
              <button type="button" class="btn btn-primary" @click="runMerge()">
                Find location to merge
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="col flex-grow-1" @shown="reloadMap()">
        <MapboxMap
          map-style="mapbox://styles/mapbox/streets-v11"
          style="height: 100%"
          access-token="pk.eyJ1IjoicmFmbnVzcyIsImEiOiIzMVE1dnc0In0.3FNMKIlQ_afYktqki-6m0g"
          @mb-created="(mapInstance) => (map = mapInstance)"
        >
          <MapboxCluster
            v-if="myLocation.length > 0"
            :data="myLocationGeojson"
            :clustersPaint="{
              'circle-color': '#558ed9',
              'circle-radius': 20,
            }"
          />
          <!--<MapboxCluster
            v-if="hotspot.length > 0"
            :data="hotspotGeojson"
            :clustersPaint="{
              'circle-color': '#cc451c',
              'circle-radius': 20,
            }"
          />-->
        </MapboxMap>
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
      showSidebar: true,
      myEBirdData: [],
      loadingData: false,
      hotspot: [],
      tileProviders: [
        {
          name: "Mapbox.Streets",
          visible: true,
          url: "https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFmbnVzcyIsImEiOiIzMVE1dnc0In0.3FNMKIlQ_afYktqki-6m0g",
          attribution: "",
        },
        {
          name: "Mapbox.Dark",
          visible: false,
          url: "https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFmbnVzcyIsImEiOiIzMVE1dnc0In0.3FNMKIlQ_afYktqki-6m0g",
          attribution: "",
        },
        {
          name: "Mapbox.Satellite",
          visible: false,
          url: "https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmFmbnVzcyIsImEiOiIzMVE1dnc0In0.3FNMKIlQ_afYktqki-6m0g",
          attribution: "",
        },
      ],
      region: [],
    };
  },
  methods: {
    formatNb(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    processFile(event) {
      this.loadingData = true;
      const reader = new FileReader();
      reader.onload = (e) => {
        const str = e.target.result;

        const delimiter = ",";
        // slice from start of text to the first \n index use split to create an array from string by delimiter
        const headersExisting = str
          .slice(0, str.indexOf("\n"))
          .split(delimiter);

        // Define list of header use
        const headers = [
          "Submission ID",
          "Location ID",
          "Location",
          "Longitude",
          "Latitude",
          "State/Province",
        ];
        const headersName = [
          "subid",
          "locid",
          "locname",
          "lng",
          "lat",
          "region",
        ];

        // Find the index of the header
        const headersIndex = headers.map((e) => {
          const ind = headersExisting.indexOf(e);
          if (ind === -1) {
            throw new TypeError(
              "CSV file not valid. It does not contains the header: " + e
            );
          }
          return ind;
        });

        // slice from \n index + 1 to the end of the text use split to create an array of each csv value row
        const rows = str.slice(str.indexOf("\n") + 1).split("\n");

        // Map the rows. split values from each row into an array use headers.reduce to create an object object properties derived from headers:values the object passed as an element of the array
        const arr = rows.map(function (row) {
          const values = row.split(delimiter);
          const el = headers.reduce(function (object, header, index) {
            object[headersName[index]] = values[headersIndex[index]];
            return object;
          }, {});
          return el;
        });

        this.myEBirdData = [
          ...new Map(arr.map((item) => [item.subid, item])).values(),
        ].filter((e) => !isNaN(e.lat) & !isNaN(e.lng));

        this.loadingData = false;

        this.region.forEach((r) => {
          r.subidnb = this.myEBirdData
            .filter(
              (s) => (s.region.split("-")[0] === r.code) | (s.region === r.code)
            )
            .reduce((b, e) => b + e.subid.length, 0);
        });

        // Fit map view to data
        this.fitMap(this.myEBirdData);
      };
      reader.readAsText(event.target.files[0]);
    },
    navTabActivate(label) {
      new bootstrap.Tab(
        document.querySelector("#mainTab .nav-item #" + label + "-tab")
      ).show();
    },
    downloadRegion(region) {
      region.status = "loading";
      axios
        .get(
          "https://ebird.org/ws2.0/ref/hotspot/" +
            region.code +
            "?fmt=json&key=vcs68p4j67pt"
        )
        .then(
          (response) =>
            (this.hotspot = [
              ...new Set([...this.hotspot, ...response.data]),
            ].filter((e) => e.locId != null))
        )
        .catch(function (error) {
          // handle error
          alert("Error with: " + region + ". " + error);
        })
        .then(() => {
          region.status = "downloaded";
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
  },
  computed: {
    myLocation() {
      return Array.from(new Set(this.myEBirdData.map((s) => s.locid))).map(
        (locId) => {
          let dataLocId = this.myEBirdData.filter((s) => s.locid === locId);
          return {
            locid: locId,
            locname: dataLocId[0].locname,
            lng: parseFloat(dataLocId[0].lng),
            lat: parseFloat(dataLocId[0].lat),
            subid: dataLocId.map((e) => e.subid),
            region: dataLocId[0].region,
          };
        }
      );
    },
    myLocationGeojson() {
      return {
        name: "NewFeatureType",
        type: "FeatureCollection",
        id: "jksdf",
        features: this.myLocation.map((e) => {
          return {
            type: "Feature",
            properties: {
              id: "location-" + e.locid,
            },
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
        name: "NewFeatureTypesdss",
        type: "FeatureCollection",
        id: "dsds",
        features: this.hotspot.map((e) => {
          return {
            type: "Feature",
            properties: {
              id: "hotspot-" + e.locId,
            },
            geometry: {
              coordinates: [e.lng, e.lat, 0],
              type: "Point",
            },
          };
        }),
      };
    },
    runMerge() {},
  },
  mounted() {
    axios
      .get(
        "https://api.ebird.org/v2/ref/region/list/country/world?key=vcs68p4j67pt"
      )
      .then((response) => {
        response.data = response.data.filter(function (obj) {
          return !["US", "CA"].includes(obj.code);
        });
        this.region = [...this.region, ...response.data];
        axios
          .get(
            "https://api.ebird.org/v2/ref/region/list/subnational1/US?key=vcs68p4j67pt"
          )
          .then((response) => {
            this.region = [...this.region, ...response.data];
            axios
              .get(
                "https://api.ebird.org/v2/ref/region/list/subnational1/CA?key=vcs68p4j67pt"
              )
              .then((response) => {
                this.region = [...this.region, ...response.data]
                  .sort((a, b) => (a.name > b.name ? 1 : -1))
                  .map((e) => {
                    e.status = null;
                    return e;
                  });
              });
          });
      });
  },
};
</script>

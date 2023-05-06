import axios from "axios";

const baseURL = "/api/annotation/";

export default {
  create(annotation) {
    return axios.post(baseURL, annotation);
  },
  // create() {
  //   return {
  //     area: 0,
  //     bbox: [0, 0, 0, 0],
  //     category_id : 6,
  //     color : "#d78200",
  //     creator : "ghbang",
  //     dataset_id : 13,  // 수정 필
  //     deleted : false,
  //     events: [],
  //     height: 2048,  // 수정 필
  //     id: 1, // 수정 필
  //     image_id: 0,  // 수정 필
  //     isbbox: false,
  //     iscrowd: false,
  //     keypoints: [],
  //     metadata: {},
  //     milliseconds: 0,
  //     paper_object: [],
  //     segmentation: [],
  //     width: 2448, // 수정 필
  //   }
  // },
  delete(id) {
    return axios.delete(`${baseURL}${id}`);
  },
  update(id, newParams) {
    return axios.put(`${baseURL}${id}`, newParams);
  }
};

import React, { useEffect, useState } from "react";

const { kakao } = window;

const Location = () => {
  const [location, setlocation] = useState("");
  const [address, setAddress] = useState("");
  const [road_address, setRoad_Address] = useState("");
  var geocoder = new kakao.maps.services.Geocoder();

  console.log("지번주소 " + address, "도로명 " + road_address);
  console.log(location);

  useEffect(() => {
    var mapContainer = document.getElementById("map"), // 지도를 표시할 div
      mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
      };

    // 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
    var map = new kakao.maps.Map(mapContainer, mapOption);

    console.log(map);
    setlocation(map);
    // 지도를 클릭한 위치에 표출할 마커입니다
    var marker = new kakao.maps.Marker({
        // 지도 중심좌표에 마커를 생성합니다
        position: map.getCenter(),
      }),
      infowindow = new kakao.maps.InfoWindow({ zindex: 1 }); // 클릭한 위치에 대한 주소를 표시할 인포윈도우입니다

    // 지도에 마커를 표시합니다
    marker.setMap(map);

    // 지도에 클릭 이벤트를 등록합니다
    // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
    kakao.maps.event.addListener(map, "click", function (mouseEvent) {
      // 클릭한 위도, 경도 정보를 가져옵니다
      var latlng = mouseEvent.latLng;
      console.log(latlng);
      // 마커 위치를 클릭한 위치로 옮깁니다
      marker.setPosition(latlng);
    });

    // 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 이벤트를 등록합니다
    kakao.maps.event.addListener(map, "click", function (mouseEvent) {
      searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          var detailAddr = !!result[0].road_address
            ? "<div>도로명주소 : " +
              result[0].road_address.address_name +
              "</div>"
            : "";
          detailAddr +=
            "<div>지번 주소 : " + result[0].address.address_name + "</div>";

          var content =
            '<div class="bAddr">' +
            '<span class="title">주소정보</span>' +
            detailAddr +
            "</div>";

          if (result[0].road_address === null) {
            setAddress(result[0].address.address_name);
            setRoad_Address("");
          } else {
            setAddress(result[0].address.address_name);
            setRoad_Address(result[0].road_address.address_name);
          }

          // 마커를 클릭한 위치에 표시합니다
          marker.setPosition(mouseEvent.latLng);
          marker.setMap(map);

          // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
          infowindow.setContent(content);
          infowindow.open(map, marker);
        }
      });
    });
  }, []);

  const searchDetailAddrFromCoords = (coords, callback) => {
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
  };

  const setCenter = () => {
    if (navigator.geolocation) {
      // GeoLocation을 이용해서 접속 위치를 얻어옵니다
      navigator.geolocation.getCurrentPosition(function (position) {
        var lat = position.coords.latitude, // 위도
          lon = position.coords.longitude; // 경도

        var locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
        Locposition(locPosition);
      });
    } else {
      // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

      var locPosition = new kakao.maps.LatLng(33.450701, 126.570667);
      Locposition(locPosition);
    }

    // 지도 중심좌표를 접속위치로 변경합니다
  };

  const Locposition = (L) => {
    location.setCenter(L);
  };

  return (
    <div>
      <div id='map' style={{ width: "500px", height: "400px" }}></div>
      {/* <input onKeyPress={onKeyPress} placeholder='검색'></input> */}
      <button onClick={setCenter}>내위치 찾기</button>
    </div>
  );
};

export default Location;

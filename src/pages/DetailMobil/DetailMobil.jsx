import { useEffect, useState } from "react";
import CardCariMobil from "../../components/CardCariMobil/CardCariMobil";
import HeaderMain from "../../components/HeaderMain/HeaderMain";
import style from "./DetailMobil.module.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import CardDetail from "../../components/CardDetail/CardDetail";
import Footer from "../../components/Footer/Footer";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import formatDate from "../../../helpers/formatDate";

const DetailMobil = () => {
  const [isLoading, setLoading] = useState({ orderMobil: false });
  const [mobil, setMobil] = useState({});
  const { idCar } = useParams();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  const OnChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  async function saveOrder(data) {
    setLoading({ orderMobil: true });
    try {
      const response = await axios.post(
        "https://api-car-rental.binaracademy.org/customer/order",
        data,
        {
          headers: {
            access_token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImN1c3RvbWVyQGJjci5pbyIsInJvbGUiOiJDdXN0b21lciIsImlhdCI6MTcwOTg2MzY1OX0.r4s8OrNGy96LM4xpP4QGEiqZspBcby8jRdmjBglO518",
          },
        }
      );

      localStorage.setItem("dataOrder", JSON.stringify({
        "idOrder" : response.data.id,
        "waktu_dibuat" : new Date()
      }));

      alert("Berhasil Order Mobil");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading({ orderMobil: false });
    }
  }

  function handleClick() {

    if(startDate == null || endDate == null) alert("Harap Isi Lama Sewa Mobil Sebelum Lanjut Ke Pembayaran !")

    const formData = {
      start_rent_at: formatDate(startDate),
      finish_rent_at: formatDate(endDate),
      car_id: mobil.id,
    };

    saveOrder(formData);
    navigate("/Pembayaran"); // Use navigate directly in handleClick function
  }

  useEffect(() => {
    const getData = async () => {
      const res = await fetch(
        `https://api-car-rental.binaracademy.org/customer/car/${idCar}`
      );
      const data = await res.json();

      setMobil(data);
    };

    getData();
  }, [idCar]);

  return (
    <>
      <HeaderMain></HeaderMain>
      <Container className={style.containerCardCariMobil}>
        <CardCariMobil disable={true} />
      </Container>

      <Container>
        <Row>
          <Col md={8}>
            <CardDetail />
          </Col>
          <Col md={4}>
            <Card className={style.card}>
              <Card.Img variant="top" src={mobil.image} className="p-4" />
              <Card.Body>
                <Card.Title>{mobil.name}</Card.Title>
                <Card.Subtitle className="text-muted my-3">
                  6 - 8 orang
                </Card.Subtitle>
                <div className="d-flex flex-column">
                  <div className="mb-3">
                    <label className="mb-2">
                      Tentukan lama sewa mobil (max. 7 hari):
                    </label>

                    <DatePicker
                      showIcon
                      popperClassName={style.popCon}
                      selected={startDate}
                      onChange={OnChange}
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      className="form-control"
                      placeholderText="Pilih tanggal mulai dan tanggal akhir sewa"
                      dateFormat="dd/MM/yyyy" // Set the date format
                      maxDate={addDays(new Date(), 7)}
                      wrapperClassName={style.datePicker}
                      isClearable
                      showMonthDropdown
                      scrollableMonthYearDropdown
                      dayClassName={(date) =>
                        startDate &&
                        endDate &&
                        date >= startDate &&
                        date <= endDate &&
                        !(
                          date.toISOString().slice(0, 10) ===
                          startDate?.toISOString().slice(0, 10)
                        ) &&
                        !(
                          date.toISOString().slice(0, 10) ===
                          endDate?.toISOString().slice(0, 10)
                        )
                          ? style.selectedRange
                          : date.toISOString().slice(0, 10) ===
                            startDate?.toISOString().slice(0, 10)
                          ? `${style.selectedStart} ${style.roundedCircle} ${style.roundedCircle} `
                          : date.toISOString().slice(0, 10) ===
                            endDate?.toISOString().slice(0, 10)
                          ? `${style.selectedEnd} ${style.roundedCircle} ${style.roundedCircle}`
                          : ""
                      }
                    />
                  </div>
                  <div className="mb-3">
                    Harga: <span className="fw-bold">Rp. {mobil.price}</span>
                  </div>
                  <div>
                    <div className="d-grid gap-2">
                      <Button
                        variant="success"
                        size="md"
                        onClick={handleClick}
                        disabled={isLoading.orderMobil}
                      >
                        {isLoading.orderMobil
                          ? "Loading..."
                          : "Lanjut Pembayaran"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Container>
        <Footer />
      </Container>
    </>
  );
};

export default DetailMobil;

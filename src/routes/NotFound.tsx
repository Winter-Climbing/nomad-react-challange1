import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const NotFoundPage = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export default function NotFound() {
  return (
    <Container>
      <NotFoundPage>
        API에 해당 정보가 없어요! <br></br> (듣보잡 코인인가봐요! 속닥속닥)
      </NotFoundPage>
    </Container>
  );
}

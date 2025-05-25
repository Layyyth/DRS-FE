import styled from "styled-components";

const StyledStat = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 1rem;
  display: flex;
  gap: 0.4rem;

  /* display: grid; */
  /* grid-template-columns: 3.4rem 1fr; */
  /* grid-template-rows: auto auto; */
  /* column-gap: 0.6rem;
  row-gap: 0.4rem; */

  & .StatInfo {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Icon = styled.div`
  /* grid-row: 1 / -1; */
  /* aspect-ratio: 1; */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  /* Make these dynamic, based on the received prop */
  background-color: var(--color-${(props) => props.color}-100);

  width: 3.2rem;
  height: 3.2rem;
  & svg {
    font-size: 2.4rem;
    color: var(--color-${(props) => props.color}-700);
  }
`;

const Title = styled.h5`
  align-self: start;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-weight: 600;
  color: var(--color-grey-500);
`;

const Value = styled.p`
  font-size: 1.3rem;
  line-height: 1;
  font-weight: 500;
`;

function Stat({ icon, title, value, color }) {
  return (
    <StyledStat>
      <Icon color={color}>{icon}</Icon>
      <div className="StatInfo">
        <Title>{title}</Title>
        <Value>{value}</Value>
      </div>
    </StyledStat>
  );
}

export default Stat;

import styled from "styled-components";

export const Pesquisa = styled.div`
  margin-bottom: 20px;
`;


export const Form = styled.form`
  display: flex;
  flex-direction: column;
  position: relative;
  .data {
    height: calc(1.5em + 0.75rem + 2px);
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 3.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    position: relative;
    width: 100%;
    label {
      font-weight: bold;
    }
    
  }

  .input {
    display: flex;
    flex-direction: column;
    min-height: '100%';
    margin-bottom: 2px;
    label {
      font-weight: bold;
      font-Size: '12px';

    }
  }

  .inputcheck {
    display: flex;
    flex-direction: column;
    margin-top: 20px;

    margin-bottom: 2px;
    label {
      font-weight: bold;
    }
    
  }
  .labelcheck {
    height: calc(2.0em + 0.75rem + 2px);

    float: left;
    margin-left: 0px;
    margin-top: 20px;
    font-weight: bold;

}

  input,
  select {
    max-height: calc(1.5em + 0.75rem + 2px);
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
    font-weight: 200;
    line-height: 1.5;
    min-height: '100%';
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    position: relative;
    width: 100%;
  }
`;

export const ButtonStyled = styled.button`
  margin-top: 5px;
  margin-left: 0px;
  width: auto;
  
  padding: 10px;
  border: 0 none;
  background-color: #00acc1;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  transition: 0.4s;
  position:relative;
  cursor: pointer;
  &:hover {
    border-radius: 20px;
    opacity: 0.7;

  }
`;


export const Container = styled.form`
/* Sticky footer styles */
html {
	height: 100%;
}
body {
	min-height: 100%;
	display: -webkit-inline-box;
  flex-direction: column;
  align-items: flex-start;
}
img {
	max-width: 100%;
	height: auto;
}
.content {
	flex: 1;
	padding: 20px;
}
.footer {
	background-color: #f5f5f5;
}


/* Custom page CSS - MOBILE first */
body > .container {
  padding: 60px 15px 0;
}

.container .text-muted {
  margin: 15px 0;
  text-align: start;
}

.card-flex {
	display: -webkit-flex;
	display: -moz-flex;
	display: -ms-flex;
	display: -o-flex;
	display: flex;
	-webkit-flex-wrap: wrap;
	-moz-flex-wrap: wrap;
	-ms-flex-wrap: wrap;
	-o-flex-wrap: wrap;
	flex-wrap: wrap;
  justify-content: flex-start;
  
	width: 100%;
}
.card-flex-item {
	display: -webkit-flex;
	display: -moz-flex;
	display: -ms-flex;
	display: -o-flex;
	display: flex; 
	width: 100%;
	padding-right: 0;
}
.card-flex-wrapper {
	display: -webkit-flex;
	display: -moz-flex;
	display: -ms-flex;
	display: -o-flex;
	display: flex;
	flex-direction: column;
	width: 100%;

	  background-color: #FFFFCC;
    border-radius: 5px;
    margin-bottom: 1em;
    margin-right: 0;
    padding: 1em;
}
.card-flex-image img {
	opacity: 1;
}
.card-flex-button {
	background-color: white;
	border: 1px solid #333; 
	padding: 0.5rem;
	color: #333;
	text-align: center;
	text-decoration: none; 
}
.card-flex-button:hover {
	color: #333;
	text-decoration: none; 
}
.btn-block {
  display: block;
  width: 100%;
}


/* Custom page CSS - iPad/Desktop  */

@media (min-width: 768px) {
	.container .text-muted {
		text-align: end;
	} 
	.card-flex-item {
		width: 33.33%;
		padding-right: 1em; 
	} 
	.card-flex-item:nth-child(3n) {
		padding-right: 0;
	} 
	.card-flex-image img {
		opacity: 0.8; 
	}
	.card-flex-wrapper:hover {
		cursor: pointer;
		background-color: white;
		box-shadow: rgba(0, 0, 0, 0.45) 0px 0px 20px 0px;
	}
	.card-flex-wrapper:hover .card-flex-image img {
		opacity: 1;
		transition: opacity 0.5s cubic-bezier(.43,.41,.22,.91);
	}
	.card-flex-wrapper:hover .card-flex-button {
		background-color: #FFFFCC; 
	}
}

`;



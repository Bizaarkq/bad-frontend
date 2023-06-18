import { Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
//import { MENU_PANEL as MENU } from '../../services/constantes';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  display: 'flex',
  alignItems: 'center',
  height: 150,
  width: '100%',
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    boxShadow: theme.shadows[4],
    cursor: 'pointer',
  }
}));


export default function Inicio({ menu }) {
  return (
    <> 
      <Grid container spacing={2}>
        {
          menu.map((item, key) => {
            return (
              <Grid item xs={6} key={key}>
                <Item component={Link} to={item.path}>
                  <Typography variant="h7" align='center' component="div" sx={{ flexGrow: 1 }}>
                    {item.name}
                  </Typography>
                </Item>  
              </Grid>
            )
          })
        }
      </Grid>
    </>
  );
}

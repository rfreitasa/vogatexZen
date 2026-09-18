import React, { useState, useEffect, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import DescriptionIcon from '@material-ui/icons/Description';
import ReceiptIcon from '@material-ui/icons/Receipt';
import PeopleIcon from '@material-ui/icons/People';
import StoreIcon from '@material-ui/icons/Store';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import BarChartIcon from '@material-ui/icons/BarChart';
import { Link } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import Fade from '@material-ui/core/Fade';
import Zoom from '@material-ui/core/Zoom';

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px',
  },

  gradientBackground: {
    background: 'linear-gradient(135deg, #144bc1 0%, #040918 100%)',
    padding: '20px',
    borderRadius: '16px 16px 0 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '-1px',
    boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)',
  },

  paper: {
    backgroundColor: theme.palette.background.paper,
    padding: '20px',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    margin: '2px 2px',
  },

  searchBar: {
    marginBottom: theme.spacing(3),
    width: '100%',

    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#f8fafc',

      '&:hover fieldset': {
        borderColor: '#2563eb',
      },

      '&.Mui-focused fieldset': {
        borderColor: '#2563eb',
        boxShadow: '0 0 0 3px rgba(37, 99, 235, 0.1)',
      },
    },
  },

  cardGrid: {
    flexGrow: 1,
    paddingTop: 16,
  },

  reportCard: {
    position: 'relative',
    height: '100%',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',

    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(37, 99, 235, 0.15)',
      borderColor: '#2563eb',
    },
  },

  cardContent: {
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  iconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80px',
    height: '80px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    marginBottom: theme.spacing(2),
    margin: '0 auto',
  },

  icon: {
    fontSize: 40,
    color: 'white',
  },

  reportTitle: {
    fontWeight: 600,
    fontSize: '18px',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: theme.spacing(1),
    lineHeight: 1.3,
  },

  reportDescription: {
    color: '#6b7280',
    textAlign: 'center',
    fontSize: '14px',
    lineHeight: 1.5,
    marginBottom: theme.spacing(2),
    flexGrow: 1,
  },

  categoryChip: {
    margin: '4px',
    fontSize: '12px',
    fontWeight: 500,
  },

  categoriesContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: theme.spacing(2),
    gap: '8px',
  },

  actionButton: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    color: 'white',
    borderRadius: '8px',
    padding: '10px 24px',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '14px',
    width: '100%',

    '&:hover': {
      background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
      boxShadow: '0 6px 12px rgba(37, 99, 235, 0.3)',
    },
  },

  emptyState: {
    textAlign: 'center',
    padding: theme.spacing(6),
    color: '#6b7280',
  },

  emptyStateIcon: {
    fontSize: 64,
    color: '#d1d5db',
    marginBottom: theme.spacing(2),
  },

  filterChips: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: theme.spacing(3),
  },
}));

export default function Relatorios() {
  const classes = useStyles();

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const restricoes = useMemo(() => {
    try {
      const dados = sessionStorage.getItem('restricoes');

      if (!dados) {
        return [];
      }

      const parsed = JSON.parse(dados);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }, []);

  const categories = {
    all: 'Todos',
    sales: 'Vendas',
    financial: 'Financeiro',
    inventory: 'Estoque',
    customers: 'Clientes',
    production: 'Programação',
    analytics: 'Analíticos',
  };

  const reports = useMemo(
    () =>
      [
        {
          id: '2',
          codigo: 'ranking_vendas',
          path: '/admin/EIR6000/EIR6000.js',
          name: 'Ranking de Vendas',
          desc: 'Análise de performance e ranking dos vendedores',
          img: FormatListNumberedIcon,
          category: 'sales',
          popular: true,
        },

        {
          id: '3',
          codigo: 'relatorio_comissoes',
          path: '/admin/EIR6000/EIR6000COM.js',
          name: 'Relatório de Comissões',
          desc: 'Cálculo detalhado de comissões por período',
          img: ReceiptIcon,
          category: 'financial',
          popular: false,
        },

        {
          id: '4',
          codigo: 'pronta_entrega',
          path: '/admin/PRONTAENTREGA',
          name: 'Pronta Entrega',
          desc: 'Produtos disponíveis para entrega imediata',
          img: AssignmentIcon,
          category: 'production',
          popular: true,
        },

        {
          id: '5',
          codigo: 'programacao',
          path: '/admin/PROGRAMACAO',
          name: 'Programação',
          desc: 'Produtos em programação',
          img: DescriptionIcon,
          category: 'production',
          popular: false,
        },

        {
          id: '6',
          codigo: 'listagem_clientes',
          path: '/admin/EGR1000',
          name: 'Listagem de Clientes',
          desc: 'Base de clientes',
          img: PeopleIcon,
          category: 'customers',
          popular: false,
        },

        {
          id: '7',
          codigo: 'estoque_imagens',
          path: '/admin/ESTOQUEIMAGEM',
          name: 'Estoque com Imagens',
          desc: 'Visualização do estoque com fotos dos produtos',
          img: CameraAltIcon,
          category: 'inventory',
          popular: true,
        },

        {
          id: '8',
          codigo: 'contas_a_receber',
          path: '/admin/CONTASARECEBER',
          name: 'Contas a Receber',
          desc: 'Fluxo de recebimentos',
          img: AttachMoneyIcon,
          category: 'financial',
          popular: false,
        },

        {
          id: '9',
          codigo: 'analise_atividade',
          path: '/admin/ALP0008',
          name: 'Análise de Atividade',
          desc: 'Métricas de performance por período',
          img: TrendingUpIcon,
          category: 'analytics',
          popular: false,
        },

        {
          id: '10',
          codigo: 'pedidos_venda',
          path: '/admin/PEDIDOSVENDA',
          name: 'Pedidos de Venda',
          desc: 'Histórico e status dos pedidos de venda',
          img: BarChartIcon,
          category: 'sales',
          popular: true,
        },

        {
          id: '11',
          codigo: 'notas_fiscais',
          path: '/admin/NOTASFISCAIS',
          name: 'Notas Fiscais',
          desc: 'Relação de pedidos por notas fiscais',
          img: ReceiptIcon,
          category: 'financial',
          popular: false,
        },

        {
          id: '12',
          codigo: 'ficha_tecnica',
          path: '/admin/FICHATECNICA',
          name: 'Ficha Técnica',
          desc: 'Download de fichas técnicas de produtos',
          img: DescriptionIcon,
          category: 'inventory',
          popular: false,
        },
      ].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  );

  const relatoriosPermitidos = useMemo(() => {
    return reports.filter(report => {
      const bloqueado = restricoes.some(restricao => {
        return (
          String(restricao.tipo).toUpperCase() === 'RELATORIO' &&
          String(restricao.codigo).toLowerCase() ===
            String(report.codigo).toLowerCase()
        );
      });

      return !bloqueado;
    });
  }, [reports, restricoes]);

  useEffect(() => {
    let filtered = relatoriosPermitidos.filter(report => {
      const search = searchTerm.toLowerCase();

      return (
        report.name.toLowerCase().includes(search) ||
        report.desc.toLowerCase().includes(search)
      );
    });

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        report => report.category === selectedCategory,
      );
    }

    setFilteredReports(filtered);
  }, [searchTerm, selectedCategory, relatoriosPermitidos]);

  const categoriasPermitidas = useMemo(() => {
    const categoriasDisponiveis = new Set(
      relatoriosPermitidos.map(report => report.category),
    );

    return Object.entries(categories).filter(([key]) => {
      if (key === 'all') {
        return true;
      }

      return categoriasDisponiveis.has(key);
    });
  }, [relatoriosPermitidos]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      return;
    }

    const existeCategoria = relatoriosPermitidos.some(
      report => report.category === selectedCategory,
    );

    if (!existeCategoria) {
      setSelectedCategory('all');
    }
  }, [selectedCategory, relatoriosPermitidos]);

  const getCategoryColor = category => {
    const colors = {
      sales: '#2563eb',

      financial: '#10b981',

      inventory: '#f59e0b',

      customers: '#8b5cf6',

      production: '#ef4444',

      analytics: '#ec4899',
    };

    return colors[category] || '#6b7280';
  };

  const getCategoryIcon = category => {
    const icons = {
      sales: TrendingUpIcon,

      financial: AttachMoneyIcon,

      inventory: StoreIcon,

      customers: PeopleIcon,

      production: AssignmentIcon,

      analytics: BarChartIcon,
    };

    return icons[category] || DescriptionIcon;
  };

  return (
    <div className={classes.root}>
      <div className={classes.gradientBackground}>
        <h2
          style={{
            margin: 0,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '24px',
            fontWeight: '600',
          }}
        >
          <span
            className="material-icons"
            style={{
              fontSize: '28px',
            }}
          >
            assessment
          </span>
          Relatórios
        </h2>
      </div>

      <Paper className={classes.paper}>
        <TextField
          className={classes.searchBar}
          variant="outlined"
          placeholder="Pesquisar relatórios por nome ou descrição..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />

        <div className={classes.filterChips}>
          {categoriasPermitidas.map(([key, label]) => {
            const CategoryIcon = getCategoryIcon(key);

            return (
              <Chip
                key={key}
                icon={
                  key !== 'all' ? (
                    <CategoryIcon
                      style={{
                        fontSize: 16,
                      }}
                    />
                  ) : (
                    undefined
                  )
                }
                label={label}
                clickable
                color={selectedCategory === key ? 'primary' : 'default'}
                variant={selectedCategory === key ? 'default' : 'outlined'}
                onClick={() => setSelectedCategory(key)}
                style={{
                  backgroundColor:
                    selectedCategory === key
                      ? getCategoryColor(key)
                      : undefined,
                }}
              />
            );
          })}
        </div>

        {filteredReports.length > 0 ? (
          <Grid container spacing={3}>
            {filteredReports.map((data, index) => (
              <Grid item key={data.id} xs={12} sm={6} md={4} lg={3}>
                <Zoom
                  in={true}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <Paper className={classes.reportCard}>
                    <div className={classes.cardContent}>
                      <div className={classes.iconContainer}>
                        <data.img className={classes.icon} />
                      </div>

                      <Typography className={classes.reportTitle}>
                        {data.name}
                      </Typography>

                      <Typography className={classes.reportDescription}>
                        {data.desc}
                      </Typography>

                      <div className={classes.categoriesContainer}>
                        <Chip
                          label={categories[data.category]}
                          size="small"
                          className={classes.categoryChip}
                          style={{
                            backgroundColor:
                              getCategoryColor(data.category) + '20',

                            color: getCategoryColor(data.category),

                            border: `1px solid ${getCategoryColor(
                              data.category,
                            )}30`,
                          }}
                        />

                        {data.popular && (
                          <Chip
                            label="Popular"
                            size="small"
                            className={classes.categoryChip}
                            style={{
                              backgroundColor: '#10b98120',

                              color: '#10b981',

                              border: '1px solid #10b98130',
                            }}
                          />
                        )}
                      </div>

                      <Link
                        to={data.path}
                        style={{
                          textDecoration: 'none',
                        }}
                      >
                        <Button
                          className={classes.actionButton}
                          startIcon={<DescriptionIcon />}
                        >
                          Acessar Relatório
                        </Button>
                      </Link>
                    </div>
                  </Paper>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Fade in={true}>
            <div className={classes.emptyState}>
              <SearchIcon className={classes.emptyStateIcon} />

              <Typography variant="h6" gutterBottom>
                Nenhum relatório encontrado
              </Typography>

              <Typography variant="body2" color="textSecondary">
                Tente ajustar os termos da pesquisa ou os filtros selecionados
              </Typography>
            </div>
          </Fade>
        )}

        <div
          style={{
            marginTop: '32px',

            paddingTop: '24px',

            borderTop: '1px solid #e5e7eb',
          }}
        >
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Chip
                label={`${relatoriosPermitidos.length} Relatórios Disponíveis`}
                variant="outlined"
                color="primary"
              />
            </Grid>

            <Grid item>
              <Chip
                label={`${
                  relatoriosPermitidos.filter(report => report.popular).length
                } Populares`}
                variant="outlined"
                style={{
                  color: '#10b981',

                  borderColor: '#10b981',
                }}
              />
            </Grid>

            <Grid item>
              <Chip
                label={`${
                  new Set(relatoriosPermitidos.map(report => report.category))
                    .size
                } Categorias`}
                variant="outlined"
                style={{
                  color: '#8b5cf6',

                  borderColor: '#8b5cf6',
                }}
              />
            </Grid>
          </Grid>
        </div>
      </Paper>
    </div>
  );
}

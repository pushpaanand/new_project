import React, { useState, useEffect } from 'react';
import { Box, Input, Button, Typography, IconButton, Link, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material';
import { BorderColor } from '@mui/icons-material';
import { COLORS } from './constants/Theme';
import Images from './constants/Images';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppsIcon from '@mui/icons-material/Apps';
import HomeIcon from '@mui/icons-material/Home';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import MenuIcon from '@mui/icons-material/Menu';

const NurseAssessmentPanel = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const [leftBarOpen, setLeftBarOpen] = useState(!isMobile);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(isMobile);

  // Update leftBarOpen when screen size changes
  useEffect(() => {
    setLeftBarOpen(!isMobile);
  }, [isMobile]);

  // Update rightPanelCollapsed when screen size changes
  useEffect(() => {
    setRightPanelCollapsed(isMobile);
  }, [isMobile]);
  const HR = 99;
  const SpO2 = 99;
  const RR = 22;
  const PS = 'Nil';
  const toggleRightPanel = () => {
    setRightPanelCollapsed(!rightPanelCollapsed);
  };

  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [selectedTab, setSelectedTab] = useState(2); // Default active tab

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleLinkClick = (assessmentType) => {
    setCurrentAssessment(assessmentType);
  };

  const handleLinkClick1 = (assessmentType) => {
    setCurrentAssessment(null);
  };

  return (
    <Box sx={styles.container}>
      {/* Overlay for mobile sidebar */}
      {leftBarOpen && isMobile && (
        <Box
          onClick={() => setLeftBarOpen(false)}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
        />
      )}
      
      {/* Left Color Bar */}
      {leftBarOpen && (
        <Box sx={styles.leftBar}>
          {isMobile && (
            <IconButton 
              onClick={() => setLeftBarOpen(false)}
              sx={{ color: 'white', mb: 1 }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <HomeIcon sx={styles.icon} />
          <AppsIcon sx={styles.icon} />
        </Box>
      )}

      {/* Main Content */}
      <Box sx={{
        ...styles.mainContent,
        width: leftBarOpen 
          ? { xs: '100%', sm: 'calc(100% - 60px)' }
          : '100%'
      }}>
        {/* Header with Logo and Search Bar */}
        <Box sx={styles.header}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'space-between', sm: 'flex-start' },
            mb: { xs: 1, sm: 0 }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!leftBarOpen && isMobile && (
                <IconButton 
                  onClick={() => setLeftBarOpen(true)}
                  sx={{ mr: 1, color: COLORS.primaryColor, padding: '4px' }}
                >
                  <MenuIcon sx={{ fontSize: '24px' }} />
                </IconButton>
              )}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                ml: { xs: 0, md: 4 },
              }}>
                <img 
                  src={Images.kauveryLogo} 
                  alt="Kauvery Hospital Logo" 
                  style={{ 
                    height: isMobile ? '30px' : '40px', 
                    width: 'auto', 
                    marginRight: isMobile ? '8px' : '16px'
                  }} 
                />
              </Box>
            </Box>
            <Box sx={{
              ...styles.headerIcons,
              display: { xs: 'flex', sm: 'flex' }
            }}>
            {/* <IconButton>
              <i style={{ fontSize: '24px' }} className="fas">
                &#xf0f3;
              </i>
            </IconButton> */}
              <IconButton sx={{
                marginLeft: { xs: 0.5, sm: 2 },
                padding: { xs: '4px', sm: '8px' },
                ':hover': {
                  backgroundColor: 'transparent',
                },
              }}>
                <NotificationsIcon sx={{ color: COLORS.primaryColor, fontSize: { xs: '20px', sm: '24px' } }} />
              </IconButton>
              <Typography sx={{
                ...styles.welcome,
                display: { xs: 'none', md: 'block' },
                fontSize: { xs: '12px', sm: '14px' }
              }}>Welcome Nurse</Typography>
              <IconButton sx={{
                marginLeft: { xs: 0.5, sm: 2 },
                padding: { xs: '4px', sm: '8px' },
                ':hover': {
                  backgroundColor: 'transparent',
                },
              }}>
                <SettingsIcon sx={{ color: COLORS.primaryColor, fontSize: { xs: '20px', sm: '24px' } }} />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{
            ...styles.searchBar,
            display: { xs: 'flex', sm: 'flex' },
            flex: { xs: 1, sm: 1 },
            width: { xs: '100%', sm: 'auto' },
            mt: { xs: 0, sm: 0 }
          }}>
            <Input 
              placeholder="Search..." 
              disableUnderline 
              fullWidth 
              sx={{
                fontSize: { xs: '12px', sm: '14px' }
              }}
            />
          </Box>
        </Box>

        {/* User Icon Bar */}
        <Box sx={styles.userBar}>
          <Box sx={{
            ...styles.userBarLeft,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            width: { xs: '100%', sm: 'auto' }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: { xs: '100%', sm: 'auto' } }}>
              <ArrowBackIcon sx={{
                ...styles.backIcon,
                fontSize: { xs: '20px', sm: '24px' }
              }} />
              <AccountCircleIcon sx={{
                ...styles.userIcon,
                fontSize: { xs: '30px', sm: '38px' }
              }} />
              <Box sx={styles.userDetails}>
                <Typography sx={{
                  ...styles.userName,
                  fontSize: { xs: '12px', sm: '14px' }
                }}>Mr. Saimurugan S (25 Y, M)</Typography>
                <Typography sx={{ 
                  fontFamily: 'Poppins', 
                  color: COLORS.textColor, 
                  fontSize: { xs: '11px', sm: '14px' } 
                }}>UHID: CM2080941611 </Typography>
              </Box>
            </Box>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              flexWrap: 'wrap',
              gap: { xs: '8px', sm: '0' },
              mt: { xs: 1, sm: 0 },
              ml: { xs: 0, sm: '20px' }
            }}>
              <Box sx={{
                ...styles.userDetails1,
                marginLeft: { xs: 0, sm: '20px' }
              }}>
                <Typography sx={{
                  ...styles.userName1,
                  fontSize: { xs: '12px', sm: '14px' }
                }}>ER1235</Typography>
                <Typography sx={{ 
                  fontFamily: 'Poppins', 
                  color: COLORS.textColor, 
                  fontSize: { xs: '11px', sm: '14px' } 
                }}>Doctor Name: Dr. John Doe</Typography>
              </Box>
              <Box sx={{
                ...styles.userDetails1,
                marginLeft: { xs: 0, sm: '20px' }
              }}>
                <Typography sx={{ 
                  fontFamily: 'Poppins', 
                  color: COLORS.textColor, 
                  fontSize: { xs: '11px', sm: '12px' } 
                }}>Adult</Typography>
                <Typography sx={{ 
                  fontFamily: 'Poppins', 
                  color: 'red', 
                  fontSize: { xs: '12px', sm: '14px' } 
                }}>Priority: 1</Typography>
              </Box>
              <Box sx={{
                ...styles.userDetails1,
                marginLeft: { xs: 0, sm: '20px' }
              }}>
                <Typography sx={{ 
                  fontFamily: 'Poppins', 
                  color: COLORS.textColor, 
                  fontSize: { xs: '11px', sm: '12px' } 
                }}>Drug Allergy: Paracetamol</Typography>
                <Typography sx={{ 
                  fontFamily: 'Poppins', 
                  color: COLORS.textColor, 
                  fontSize: { xs: '11px', sm: '12px' } 
                }}>Food Allergy: Brinjal</Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{
            ...styles.userBarRight,
            mt: { xs: 1, sm: 0 },
            ml: { xs: 0, sm: 'auto' }
          }}>
            {/* <IconButton onClick={toggleRightPanel}>
              &#128065;
            </IconButton>  */}
            <IconButton sx={{
              marginLeft: { xs: 0.5, sm: 2 },
              padding: { xs: '4px', sm: '8px' },
              ':hover': {
                backgroundColor: 'transparent',
              },
            }}
              onClick={toggleRightPanel}
            >
              <WebAssetIcon sx={{ 
                color: COLORS.primaryColor,
                fontSize: { xs: '20px', sm: '24px' }
              }} />
            </IconButton>
            <ImportContactsIcon sx={{ 
              color: COLORS.primaryColor,
              fontSize: { xs: '20px', sm: '24px' },
              marginLeft: { xs: 0.5, sm: 1 }
            }} />
            <PermContactCalendarIcon sx={{ 
              color: COLORS.primaryColor,
              fontSize: { xs: '20px', sm: '24px' },
              marginLeft: { xs: 0.5, sm: 1 }
            }} />
          </Box>
        </Box>

        {/* Main Panel */}
        <Box sx={{
          ...styles.mainPanel,
          flexDirection: { xs: 'column', md: 'row' }
        }}>
          {/* Left Panel (Nurse Assessment) */}
          <Box sx={{ 
            ...styles.leftPanel, 
            width: { 
              xs: '100%', 
              md: rightPanelCollapsed ? '100%' : '70%' 
            },
            padding: { xs: '10px', sm: '20px' }
          }}>
            <Typography variant="h6" sx={{ 
              fontFamily: 'Poppins', 
              color: COLORS.primaryColor, 
              fontSize: { xs: '14px', sm: '16px' }, 
              marginRight: '20px', 
              textAlign: { xs: 'left', sm: 'center' }, 
              alignItems: 'center',
              mb: { xs: 1, sm: 2 }
            }}>Nurse Assessment</Typography>
            {/* <Box style={styles.root}>
              <Tabs
                value={selectedTab}
                onChange={handleChange}
                style={styles.tabBar}
                TabIndicatorProps={{ style: { display: 'none' } }} // Hide indicator
                variant="fullWidth" // Make tabs fill full width for flexibility
              >
                <Tab
                  label="Triage"
                  style={selectedTab === 0 ? styles.activeTab : styles.hiddenTab}
                />
                <Tab
                  label="Initial Assessment"
                  style={selectedTab === 1 ? styles.activeTab : styles.hiddenTab}
                />
                <Tab
                  label="Nurse Assessment"
                  style={selectedTab === 2 ? styles.activeTab : styles.hiddenTab}
                />
                <Tab
                  label="Nurse Re-Assessment"
                  style={selectedTab === 3 ? styles.activeTab : styles.hiddenTab}
                />
              </Tabs>
            </Box> */}
            {/* Five Menu Buttons */}
            <Box sx={{
              ...styles.menuButtons,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: '8px', sm: '0' }
            }}>
              <Button variant="outlined" sx={{
                ...styles.menuButton,
                width: { xs: '100%', sm: 'auto' },
                flex: { xs: 'none', sm: 1 },
                fontSize: { xs: '9px', sm: '10px' },
                padding: { xs: '8px', sm: '10px' }
              }} style={{ backgroundColor: COLORS.primaryColor, color: 'white' }}>Vitals</Button>
              <Button variant="outlined" sx={{
                ...styles.menuButton,
                width: { xs: '100%', sm: 'auto' },
                flex: { xs: 'none', sm: 1 },
                fontSize: { xs: '9px', sm: '10px' },
                padding: { xs: '8px', sm: '10px' }
              }}>Medication administration</Button>
              <Button variant="outlined" sx={{
                ...styles.menuButton,
                width: { xs: '100%', sm: 'auto' },
                flex: { xs: 'none', sm: 1 },
                fontSize: { xs: '9px', sm: '10px' },
                padding: { xs: '8px', sm: '10px' }
              }}>Lines & tubes Tracking</Button>
              <Button variant="outlined" sx={{
                ...styles.menuButton,
                width: { xs: '100%', sm: 'auto' },
                flex: { xs: 'none', sm: 1 },
                fontSize: { xs: '9px', sm: '10px' },
                padding: { xs: '8px', sm: '10px' }
              }}>Intake</Button>
              <Button variant="outlined" sx={{
                ...styles.menuButton,
                width: { xs: '100%', sm: 'auto' },
                flex: { xs: 'none', sm: 1 },
                fontSize: { xs: '9px', sm: '10px' },
                padding: { xs: '8px', sm: '10px' }
              }}>Output</Button>
              <Button variant="outlined" sx={{
                ...styles.menuButton,
                width: { xs: '100%', sm: 'auto' },
                flex: { xs: 'none', sm: 1 },
                fontSize: { xs: '9px', sm: '10px' },
                padding: { xs: '8px', sm: '10px' }
              }}>Notes</Button>
            </Box>

            <Box sx={{
              ...styles.vitals,
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Box sx={{
                ...styles.vitalItem,
                width: { xs: '100%', sm: '20%' }
              }}>
                <Typography sx={{ 
                  fontFamily: 'Poppins', 
                  color: COLORS.placeholderColor, 
                  fontSize: { xs: '12px', sm: '14px' } 
                }}>HR (bpm):</Typography>
                <Input type="text" defaultValue="99" sx={styles.input} />
              </Box>
              <Box sx={{
                ...styles.vitalItem,
                width: { xs: '100%', sm: '20%' }
              }}>
                <Typography sx={{ 
                  fontFamily: 'Poppins', 
                  color: COLORS.placeholderColor, 
                  fontSize: { xs: '12px', sm: '14px' } 
                }}>SpO2 (%):</Typography>
                <Input type="text" defaultValue="99" sx={styles.input} />
              </Box>
              <Box sx={{
                ...styles.vitalItem,
                width: { xs: '100%', sm: '20%' }
              }}>
                <Typography sx={{ 
                  fontFamily: 'Poppins', 
                  color: COLORS.placeholderColor, 
                  fontSize: { xs: '12px', sm: '14px' } 
                }}>RR (bpm):</Typography>
                <Input type="text" defaultValue="22" sx={styles.input} />
              </Box>
              <Box sx={{
                ...styles.vitalItem,
                width: { xs: '100%', sm: '20%' }
              }}>
                <Typography sx={{ 
                  fontFamily: 'Poppins', 
                  color: COLORS.placeholderColor, 
                  fontSize: { xs: '12px', sm: '14px' } 
                }}>Temperature (F):</Typography>
                <Input type="text" defaultValue="98" sx={styles.input} />
              </Box>
            </Box>
            <Button variant="contained" sx={{
              ...styles.submitButton,
              width: { xs: '100%', sm: '20%' },
              padding: { xs: '12px', sm: '10px' },
              fontSize: { xs: '12px', sm: '14px' }
            }}>Submit</Button>
          </Box>

          {/* Right Panel (Vitals Summary with Tabs) */}
          {!rightPanelCollapsed && (
            <Box sx={{
              ...styles.rightPanel,
              width: { xs: '100%', md: '30%' },
              padding: { xs: '10px', sm: '20px' },
              border: { xs: 'none', md: '1px solid #ccc' },
              boxShadow: { xs: 'none', md: '-4px 0px 10px rgba(0,0,0,0.1)' }
            }}>
              {/* <Box sx={styles.cardsContainer}> */}
              {/* Date and Time */}
              {/* <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontFamily: 'Poppins', color: COLORS.primaryColor, fontSize: '12px' }}>20/6/24 </Typography>
                  <Typography sx={{ fontFamily: 'Poppins', color: COLORS.primaryColor, fontSize: '12px' }}> <AccessTimeIcon sx={{color: COLORS.primaryColor, fontSize: '15px'}}/> 09:10 A.M.</Typography>
                  <Typography variant="h6" sx={{ fontFamily: 'Poppins', color: COLORS.primaryColor, fontSize: '16px', marginRight:'20px' }}>Patient Records</Typography>
                </Box> */}

              {currentAssessment ? (
                <Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                    {/* <Typography sx={{ fontFamily: 'Poppins', color: COLORS.primaryColor, fontSize: '12px' }}>20/6/24 </Typography>
                  <Typography sx={{ fontFamily: 'Poppins', color: COLORS.primaryColor, fontSize: '12px' }}> <AccessTimeIcon sx={{color: COLORS.primaryColor, fontSize: '15px'}}/> 09:10 A.M.</Typography> */}
                    <Typography variant="h6" sx={{ fontFamily: 'Poppins', color: COLORS.primaryColor, fontSize: '16px', marginRight: '20px' }}>Patient Records</Typography>
                    <KeyboardArrowDownIcon sx={{ color: COLORS.primaryColor }} />
                    <ZoomOutIcon sx={{ color: COLORS.primaryColor, marginLeft: '50%' }} onClick={() => handleLinkClick1('Nurse Re-assessment')}/>
                  </Box>
                  <Box sx={{ marginBottom: '20px', display: 'flex', flexDirection: 'row' }}>
                    <Typography variant="h6" sx={styles.cardTitle} style={{marginTop: '5px'}}>Triage:</Typography>
                    <Link
                      href="#"
                      onClick={() => handleLinkClick('Initial Assessment')}
                      sx={{
                        ...styles.link,
                        textDecoration: 'underline', // Keep underline for a link appearance
                        color: 'primary.main', // Link color
                        marginRight: '10px', // Space between links
                        '&:hover': {
                          color: 'primary.dark', // Darker shade on hover
                        },
                      }}
                    >
                      Initial Assessment
                    </Link>

                    <Link
                      href="#"
                      onClick={() => handleLinkClick1('Nurse Re-assessment')}
                      sx={{
                        ...styles.link,
                        textDecoration: 'underline',
                        color: 'primary.main',
                        '&:hover': {
                          color: 'primary.dark',
                        },
                      }}
                    >
                      Nurse Re-assessment
                    </Link>
                  </Box>
                  <Box sx={styles.vitalsSummary}>
                    <Box sx={styles.vitalsDetails}>
                      <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: COLORS.textColor }}><strong>Vitals</strong></Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: COLORS.textColor }}>HR(bpm): 99</Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: COLORS.textColor }}>SpO2(%): 99</Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: COLORS.textColor }}>RR(bpm): 22</Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: COLORS.textColor }}>Temperature(F): 98</Typography>
                    </Box>

                    <Box sx={styles.summaryDetails}>
                      <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: COLORS.textColor }}><strong>Summary</strong></Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: COLORS.textColor }}>Complaints: Stomach Pain</Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: COLORS.textColor }}>Past history: DM</Typography>
                      <Typography sx={{ fontFamily: 'Poppins', fontSize: '14px', color: COLORS.textColor }}>Past Surgery: {PS}</Typography>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontFamily: 'Poppins', color: COLORS.primaryColor, fontSize: '12px' }}>20/6/24 </Typography>
                    <Typography sx={{ fontFamily: 'Poppins', color: COLORS.primaryColor, fontSize: '12px' }}> <AccessTimeIcon sx={{ color: COLORS.primaryColor, fontSize: '15px' }} /> 09:10 A.M.</Typography>
                    <Typography variant="h6" sx={{ fontFamily: 'Poppins', color: COLORS.primaryColor, fontSize: '16px', marginRight: '20px' }}>Patient Records</Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'column', md: 'row' }, 
                    gap: { xs: '10px', md: '20px' } 
                  }}>
                    {/* Vitals & Summary Column */}
                    <Box sx={{ flex: 1, width: { xs: '100%', md: 'auto' } }}>
                      <Box sx={styles.card}>
                        <Typography variant="h6" sx={{
                          ...styles.cardTitle,
                          fontSize: { xs: '14px', sm: '16px' }
                        }}>Vitals</Typography>
                        <Box sx={{
                          ...styles.vitals,
                          flexDirection: { xs: 'column', sm: 'row' }
                        }}>
                          <Box sx={{
                            ...styles.vitalItem,
                            width: { xs: '100%', sm: '50%', md: 'auto' }
                          }}>
                            <Typography sx={{ 
                              fontFamily: 'Poppins', 
                              color: COLORS.placeholderColor, 
                              fontSize: { xs: '11px', sm: '12px' } 
                            }}>HR (bpm):</Typography>
                            <Input type="text" defaultValue="99" sx={styles.input} />
                          </Box>
                          <Box sx={{
                            ...styles.vitalItem,
                            width: { xs: '100%', sm: '50%', md: 'auto' }
                          }}>
                            <Typography sx={{ 
                              fontFamily: 'Poppins', 
                              color: COLORS.placeholderColor, 
                              fontSize: { xs: '11px', sm: '12px' } 
                            }}>SpO2 (%):</Typography>
                            <Input type="text" defaultValue="99" sx={styles.input} />
                          </Box>
                          <Box sx={{
                            ...styles.vitalItem,
                            width: { xs: '100%', sm: '50%', md: 'auto' }
                          }}>
                            <Typography sx={{ 
                              fontFamily: 'Poppins', 
                              color: COLORS.placeholderColor, 
                              fontSize: { xs: '11px', sm: '12px' } 
                            }}>RR (bpm):</Typography>
                            <Input type="text" defaultValue="22" sx={styles.input} />
                          </Box>
                          <Box sx={{
                            ...styles.vitalItem,
                            width: { xs: '100%', sm: '50%', md: 'auto' }
                          }}>
                            <Typography sx={{ 
                              fontFamily: 'Poppins', 
                              color: COLORS.placeholderColor, 
                              fontSize: { xs: '11px', sm: '12px' } 
                            }}>Temp (F):</Typography>
                            <Input type="text" defaultValue="98" sx={styles.input} />
                          </Box>
                        </Box>
                      </Box>

                      {/* Summary Card */}
                      <Box sx={styles.card}>
                        <Typography variant="h6" sx={{
                          ...styles.cardTitle,
                          fontSize: { xs: '14px', sm: '16px' }
                        }}>Summary</Typography>
                        <Typography sx={{ 
                          fontFamily: 'Poppins', 
                          fontSize: { xs: '12px', sm: '14px' }, 
                          color: COLORS.textColor 
                        }}>Chief Complaint: Stomach Pain</Typography>
                        <Typography sx={{ 
                          fontFamily: 'Poppins', 
                          fontSize: { xs: '12px', sm: '14px' }, 
                          color: COLORS.textColor 
                        }}>Past Medical History: Diabetes</Typography>
                      </Box>
                    </Box>

                    {/* Triage Card */}
                    <Box sx={{ flex: 1, width: { xs: '100%', md: 'auto' } }}>
                      <Box sx={styles.card}>
                        <Typography variant="h6" sx={{
                          ...styles.cardTitle,
                          fontSize: { xs: '14px', sm: '16px' }
                        }}>Triage</Typography>
                        <Box>
                          <Link
                            href="#"
                            onClick={() => handleLinkClick('Initial Assessment')}
                            sx={{
                              ...styles.link,
                              textDecoration: 'underline', // Keep underline for a link appearance
                              color: 'primary.main', // Link color
                              marginRight: '10px', // Space between links
                              '&:hover': {
                                color: 'primary.dark', // Darker shade on hover
                              },
                            }}
                          >
                            Initial Assessment
                          </Link>
                        </Box>
                        <Box>
                          <Link
                            href="#"
                            onClick={() => handleLinkClick1('Nurse Re-assessment')}
                            sx={{
                              ...styles.link,
                              textDecoration: 'underline',
                              color: 'primary.main',
                              '&:hover': {
                                color: 'primary.dark',
                              },
                            }}
                          >
                            Nurse Re-assessment
                          </Link>
                        </Box>
                        <Typography variant="h6" sx={{ 
                          color: 'white',
                          fontSize: { xs: '14px', sm: '16px' }
                        }}>Summary</Typography>
                        <Typography sx={{ 
                          fontFamily: 'Poppins', 
                          fontSize: { xs: '12px', sm: '14px' }, 
                          color: 'white' 
                        }}>Chief Complaint: Stomach Pain</Typography>
                        <Typography sx={{ 
                          fontFamily: 'Poppins', 
                          fontSize: { xs: '12px', sm: '14px' }, 
                          color: 'white' 
                        }}>Past Medical History: Diabetes</Typography>
                        <Typography sx={{ 
                          fontFamily: 'Poppins', 
                          fontSize: { xs: '12px', sm: '14px' }, 
                          color: 'white' 
                        }}>Chief Complaint: Stomach Pain</Typography>
                        <Typography sx={{ 
                          fontFamily: 'Poppins', 
                          fontSize: { xs: '12px', sm: '14px' }, 
                          color: 'white' 
                        }}>Past Medical History: Diabetes</Typography>
                      </Box>
                    </Box>
                  </Box>


                  <Box sx={styles.card}>
                    <Typography variant="h6" sx={{
                      ...styles.cardTitle,
                      fontSize: { xs: '14px', sm: '16px' }
                    }}>Triage</Typography>
                    <Box sx={styles.vitalsSummary}>
                      <Box sx={styles.vitalsDetails}>
                        <Typography sx={{ 
                          fontFamily: 'Poppins', 
                          fontSize: { xs: '12px', sm: '14px' }, 
                          color: COLORS.textColor 
                        }}><strong>Vitals</strong></Typography>
                        <Typography sx={{ 
                          fontFamily: 'Poppins', 
                          fontSize: { xs: '12px', sm: '14px' }, 
                          color: COLORS.textColor 
                        }}>HR(bpm): {HR}</Typography>
                        <Typography sx={{ 
                          fontFamily: 'Poppins', 
                          fontSize: { xs: '12px', sm: '14px' }, 
                          color: COLORS.textColor 
                        }}>SpO2(%): {SpO2}</Typography>
                        <Typography sx={{ 
                          fontFamily: 'Poppins', 
                          fontSize: { xs: '12px', sm: '14px' }, 
                          color: COLORS.textColor 
                        }}>RR(bpm): {RR}</Typography>
                        <Typography sx={{ 
                          fontFamily: 'Poppins', 
                          fontSize: { xs: '12px', sm: '14px' }, 
                          color: COLORS.textColor 
                        }}>Temperature(F): 98</Typography>
                      </Box>

                      <Box sx={styles.summaryDetails}>
                        <Typography sx={{ 
                          fontFamily: 'Poppins', 
                          fontSize: { xs: '12px', sm: '14px' }, 
                          color: COLORS.textColor 
                        }}><strong>Summary</strong></Typography>
                        <Typography sx={{ 
                          fontFamily: 'Poppins', 
                          fontSize: { xs: '12px', sm: '14px' }, 
                          color: COLORS.textColor 
                        }}>Complaints: Stomach Pain</Typography>
                        <Typography sx={{ 
                          fontFamily: 'Poppins', 
                          fontSize: { xs: '12px', sm: '14px' }, 
                          color: COLORS.textColor 
                        }}>Past history: DM</Typography>
                        <Typography sx={{ 
                          fontFamily: 'Poppins', 
                          fontSize: { xs: '12px', sm: '14px' }, 
                          color: COLORS.textColor 
                        }}>Past Surgery: {PS}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100%',
    overflow: 'hidden',
  },
  leftBar: {
    backgroundColor: '#972168',
    width: { xs: '250px', sm: '60px' },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: { xs: '10px 0', sm: '20px 0' },
    position: { xs: 'fixed', sm: 'relative' },
    zIndex: { xs: 1000, sm: 1 },
    height: { xs: '100vh', sm: '100vh' },
    left: { xs: 0, sm: 'auto' },
    top: { xs: 0, sm: 'auto' },
  },
  icon: {
    margin: '15px 0',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer',
  },
  mainContent: {
    width: { xs: '100%', sm: 'calc(100% - 60px)' },
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    backgroundColor: 'white',
    padding: { xs: '8px 10px', sm: '10px 20px' },
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 0 8px rgba(7, 7, 7, 0.1)',
    flexWrap: { xs: 'wrap', sm: 'nowrap' },
    gap: { xs: '8px', sm: '0' },
  },
  logoImage: {
    width: '100px',
    marginRight: '15px',
  },
  searchBar: {
    flex: 1,
    paddingLeft: { xs: '0', sm: '15px' },
    width: { xs: '100%', sm: 'auto' },
    order: { xs: 3, sm: 2 },
  },
  headerIcons: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userBar: {
    backgroundColor: 'white',
    padding: { xs: '10px', sm: '15px 20px' },
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: { xs: 'flex-start', sm: 'center' },
    boxShadow: '0 0 8px rgba(7, 7, 7, 0.1)',
    border: '1px solid #ccc',
    flexDirection: { xs: 'column', sm: 'row' },
    gap: { xs: '10px', sm: '0' },
  },
  userBarLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: '24px',
    marginRight: '10px',
    cursor: 'pointer',
    color: COLORS.primaryColor,
    fontWeight: 'bold'
  },
  userIcon: {
    fontSize: '38px',
    marginRight: '10px',
    color: COLORS.primaryColor
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  userDetails1: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: '20px'
  },
  userName: {
    fontWeight: 'bold',
    fontSize: '14px',
    fontFamily: 'Poppins',
    color: COLORS.primaryColor
  },
  userName1: {
    fontWeight: 'bold',
    fontSize: '14px',
    fontFamily: 'Poppins',
    color: COLORS.primaryColor
  },
  welcome: {
    fontWeight: 'bold',
    fontFamily: 'Poppins',
    color: COLORS.textColor
  },
  userBarRight: {
    display: 'flex',
    alignItems: 'center',
  },
  mainPanel: {
    display: 'flex',
    flexGrow: 1,
    overflow: 'hidden',
  },
  leftPanel: {
    backgroundColor: 'white',
    padding: '20px',
    overflowY: 'auto',
    transition: 'width 0.3s ease',
  },
  menuButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: { xs: '15px', sm: '20px' },
    gap: { xs: '8px', sm: '0' },
  },
  menuButton: {
    backgroundColor: '#D3D3D3',
    color: 'white',
    marginTop: { xs: '0', sm: '20px' },
    padding: { xs: '8px', sm: '10px' },
    width: { xs: '100%', sm: 'auto' },
    borderRadius: '8px',
    borderColor: 'transparent',
    fontFamily: 'Poppins',
    fontSize: { xs: '9px', sm: '10px' },
    textTransform: 'none',
    color: COLORS.textColor,
    flex: { xs: 'none', sm: 1 },
  },
  vitals: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    rowGap: { xs: '15px', sm: '20px' },
    columnGap: { xs: '0', sm: '10px' },
  },
  vitalItem: {
    display: 'flex',
    flexDirection: 'column',
    width: '20%', // Adjust for responsiveness
  },
  input: {
    marginTop: '8px',
    padding: { xs: '6px', sm: '8px' },
    width: '100%',
    border: '1px solid #ccc',
    height: { xs: '35px', sm: '40px' },
    color: COLORS.textColor,
    fontSize: { xs: '12px', sm: '14px' }
  },
  submitButton: {
    backgroundColor: '#972168',
    color: 'white',
    marginTop: '20px',
    padding: '10px',
    width: '20%',
    borderRadius: '8px',
    textTransform: 'none'
  },
  // rightPanel: {
  //   backgroundColor: 'white',
  //   borderColor: 'grey',
  //   border: '1px solid #ccc',
  //   width: '50%',
  //   padding: '20px',
  //   boxShadow: '-4px 0px 10px rgba(0,0,0,0.1)',
  //   overflowY: 'auto',
  //   transition: 'width 0.3s ease',
  // },
  // rightPanelTitle: {
  //   marginBottom: '10px',
  // },
  // vitalsSummary: {
  //   display: 'flex',
  //   flexDirection: 'column',
  // },
  vitalsDetails: {
    marginBottom: '20px',
  },
  // summaryDetails: {
  //   marginBottom: '20px',
  // },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '20px',
  },
  tabButton: {
    flexGrow: 1,
    margin: '0 5px',
  },
  cardsContainer: {
    marginBottom: '20px',
  },
  // card: {
  //   backgroundColor: '#ffffff',
  //   padding: '15px',
  //   borderRadius: '10px',
  //   marginBottom: '15px',
  //   // border: 0.1,
  //   boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
  //   justifyContent: 'space-between'
  // },
  // cardTitle: {
  //   marginBottom: '10px',
  //   fontFamily: 'Poppins',
  //   fontSize: '14px',
  //   color: COLORS.textColor,
  //   fontWeight: 'bold'
  // },
  // vitalItem: {
  //   marginBottom: '10px',
  //   display: 'flex',
  //   alignItems: 'center',
  // },
  // input: {
  //   marginLeft: '10px',
  //   width: '100px',
  // },
  linkButton: {
    marginRight: '10px', // Space between buttons
    display: 'inline-block',
  },
  rightPanel: {
    backgroundColor: 'white',
    borderColor: 'grey',
    border: { xs: 'none', md: '1px solid #ccc' },
    width: { xs: '100%', md: '30%' },
    padding: { xs: '10px', sm: '20px' },
    boxShadow: { xs: 'none', md: '-4px 0px 10px rgba(0,0,0,0.1)' },
    overflowY: 'auto',
    transition: 'width 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  rightPanelTitle: {
    marginBottom: '10px',
  },
  cardsContainer: {
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column', // Column layout for smaller screens
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: { xs: '10px', sm: '15px' },
    borderRadius: '10px',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: { xs: '10px', sm: '0' },
  },
  cardTitle: {
    marginBottom: { xs: '8px', sm: '10px' },
    fontFamily: 'Poppins',
    fontSize: { xs: '14px', sm: '16px' },
    color: COLORS.primaryColor,
    fontWeight: 'bold',
  },
  link: {
    textDecoration: 'underline', // Underline for link appearance
    color: 'primary.main', // Link color
    marginRight: '10px',
    marginLeft: '10px',
    '&:hover': {
      color: 'primary.dark', // Darker shade on hover
    },
  },
  vitalsSummary: {
    // display: 'flex',
    flexDirection: 'column',
    // gap: '15px', 
    backgroundColor: 'white',
    borderColor: 'grey',
    border: '1px solid #ccc',
    width: '100%', // Adjusted for flexibility
    height: '100%',
    padding: '20px',
    boxShadow: '-4px 0px 10px rgba(0,0,0,0.1)',
    overflowY: 'auto',
    transition: 'width 0.3s ease',
    display: 'flex', // Flex dis
  },
  vitalsDetails: {
    fontFamily: 'Poppins',
    fontSize: '14px',
    color: 'black', // Direct color reference or COLORS.textColor
  },
  summaryDetails: {
    fontFamily: 'Poppins',
    fontSize: '14px',
    color: 'black', // Direct color reference or COLORS.textColor
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: '0px',
    backgroundColor: '#f7f7f7', // Background color of the tab section
  },
  tabBar: {
    width: '100%',
    maxWidth: 'auto',
    fontSize: '10px',
    fontFamily: 'Poppins',
    textTransform: 'none',// Make it responsive for smaller devices
  },
  tab: {
    fontSize: '10px',
    minWidth: 'auto',
    textTransform: 'none',
    color: '#ccc', // Hidden color for inactive tabs
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '50%', 
    fontFamily: 'Poppins'
  },
  activeTab: {
    color: '#e91e63', // Active tab color (pink for example)
    fontWeight: 'bold',
    '&::before': {
      content: '"●"', // Dot before the active tab text
      color: '#e91e63',
      marginRight: '4px',
    },
  },
  hiddenTab: {
    color: '#bbb', // Color for inactive or hidden tabs
    '&::before': {
      content: '"- "', // Hyphen before the inactive tab text
      marginRight: '4px',
    },
  },
  // Responsive adjustments
  '@media (min-width: 500px)': {
    rightPanel: {
      width: '50%', // Adjust width for larger screens
    },
    cardsContainer: {
      flexDirection: 'row', // Row layout for larger screens
      justifyContent: 'space-between',
    },
  },
};

export default NurseAssessmentPanel;

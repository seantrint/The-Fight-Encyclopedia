import PyPDF2
import tabula
import pandas
import pickle
import re
import string
import os
import fileinput
import fitz
import pyodbc 
import geograpy
import nltk
#boxer names were saved from index sections of book
#we want to use these names as keys to pick up on patters in certain pages of the book to save data we need
#e.g. Mike Tyson with a certain font-size -> save image on this page
def writeImagePathToDb(boxerName,boxerId):
    singleQuote = "'"
    updateConn = pyodbc.connect('Driver={SQL Server};'
                      'Server=WINDOWS-25B0042\SQLEXPRESS,1433;'
                      'Database=autoboxing;'
                      'Trusted_Connection=yes;')     
    try:           
        updateCursor = updateConn.cursor()    
        
        updateQuery = 'Update BoxerData set ImageReference = {2}img/{0}.png{2} where BoxerId = {1}'.format(boxerName,boxerId,singleQuote)
        
        updateCursor.execute(updateQuery)
        
        updateCursor.commit()
        
        updateCursor.close()
        updateConn.close()  
    except:
        print('update image failed')
    
def saveWldRecord(page,boxerId):
    try:
        linelist = []
        singleQuote = "'"
        for line in page:
            linelist.append(line)   
            
        updateConn = pyodbc.connect('Driver={SQL Server};'
                          'Server=WINDOWS-25B0042\SQLEXPRESS,1433;'
                          'Database=autoboxing;'
                          'Trusted_Connection=yes;')                
        updateCursor = updateConn.cursor()    
        
        recordIndex = [i for i, s in enumerate(linelist) if 'WON' in s]
        # koIndex = [i for i, s in enumerate(linelist) if 'KO' in s]
        
        if recordIndex:
            wins = linelist[recordIndex[0]+3]
            loss = linelist[recordIndex[0]+4]
            draws = linelist[recordIndex[0]+5]
            
            updateWinsQuery = 'Update BoxerData set Wins = {0} where BoxerId = {1}'.format(wins, boxerId)   
            updateLossQuery = 'Update BoxerData set Losses = {0} where BoxerId = {1}'.format(loss, boxerId)
            updateDrawsQuery = 'Update BoxerData set Draws = {0} where BoxerId = {1}'.format(draws, boxerId)
            
            overallRecord = str(wins+'/'+loss+'/'+draws)
            overallRecordQuery = 'Update BoxerData set CompleteRecord = {2}{0}{2} where BoxerId = {1}'.format(overallRecord, boxerId, singleQuote)
            
            # if koIndex:
            #     winsKo = linelist[koIndex[-2]+8]
            #     updateWinsKoQuery = 'Update BoxerData set WinsKo = {0} where BoxerId = {1}'.format(winsKo, boxerId)  
            #     updateCursor.execute(updateWinsKoQuery)
                
            updateCursor.execute(updateWinsQuery)
            updateCursor.execute(updateLossQuery)
            updateCursor.execute(updateDrawsQuery)
            updateCursor.execute(overallRecordQuery)
            
            updateCursor.commit()
            
            updateCursor.close()
            updateConn.close()           
    except:
        print('record fetch failed')          

            
nameslist = []
idlist = []
conn = pyodbc.connect('Driver={SQL Server};'
                      'Server=WINDOWS-25B0042\SQLEXPRESS,1433;'
                      'Database=autoboxing;'
                      'Trusted_Connection=yes;')

cursor = conn.cursor()
#select every name from db
cursor.execute('SELECT BoxerName, BoxerId from BoxerData')
nltk.download('punkt')
for row in cursor:
    nameslist.append(row[0])
    idlist.append(row[1]) 
cursor.close()
conn.close()    
#search the pdf for every name from the db    
#pathAndFileName = 'C:/Users/Sean/Desktop/projects/textfiles_uncleaned/entirepdf.txt'    
#file = open(pathAndFileName,'w', encoding = "utf-8")

idCount = 0
for name in nameslist:
    boxerId = idlist[idCount]
    print(boxerId)
    imageName = name#get this from db
    print(imageName)
    i = 0
    picFound = 0
    pdfFileObj = open('C:/Users/Sean/Desktop/projects/Pdfs_from_scan/The boxing register  International Boxing Hall of Fame official record book by Roberts, James B. Skutt, Alexander G (z-lib.org).pdf', 'rb')
    doc = fitz.open('C:/Users/Sean/Desktop/projects/Pdfs_from_scan/The boxing register  International Boxing Hall of Fame official record book by Roberts, James B. Skutt, Alexander G (z-lib.org).pdf')    
    pdfReader = PyPDF2.PdfFileReader(pdfFileObj)    
    #for every page in book
    while i<818:
        pageinfo = pdfReader.getPage(i)
        textForFile = pageinfo.extractText()
        #search current name against the current page of the pdf
        ResSearch = str(re.search(imageName, textForFile))
        #'match=' is contained in the string when a search result is found, otherwise it says None
        if 'match=' in ResSearch:
            #print(ResSearch)
            spanList = str(re.findall('\d+', ResSearch))
            spanList = re.sub(r"'", '', spanList)     
            spanList = spanList.replace('[','').replace(']','')
            spanList = spanList.replace(',','')
            spanList = spanList.split()     
            linelist = []          
            for line in doc[i].getText().splitlines():
                linelist.append(line)
                if(imageName == line):     
                    pageafter = doc[i+1].getText().splitlines()
                    #findResults = str(re.findall('\d+', pageafter))
                    # print(findResults[-70:])
                    if 'WON' in pageafter:
                        saveWldRecord(pageafter,boxerId)                      
                    #eliminate occurences when it detects name in the fight history
                    linebefore = linelist[len(linelist)-2]
                    search4digits = re.findall(r"\d{4,7}", linebefore)
                    searchDied = re.findall(r"Died: ", linebefore)
                    searchBorn = re.findall(r"Born: ", linebefore)
                    if not search4digits or searchDied or searchBorn:
                        for img in doc.getPageImageList(i): 
                            xref = img[0]
                            print(img)
                            if img[2] < 300:
                                pathForImage = "C:/Users/Sean/Desktop/projects/boxing_nodejs/The-Fight-Encyclopedia/public/img/{0}.png".format(imageName)
                                pix = fitz.Pixmap(doc, xref)
                                if picFound <1: 
                                    if pix.n - pix.alpha < 4:     
                                        pix.writePNG(pathForImage)
                                        writeImagePathToDb(imageName, boxerId)
                                        picFound = 1
                                    else:
                                        pix1 = fitz.Pixmap(fitz.csRGB, pix)
                                        pix1.writePNG(pathForImage)
                                        writeImagePathToDb(imageName, boxerId)
                                        pix1 = None
                                        picFound = 1
                                    pix = None
                                #search for text patterns
                                stance = ''
                                for line in doc[i].getText().splitlines():
                                    if 'Born:' in line:
                                        birthDate = line
                                    if 'RH' in line:
                                        stanceHeightReachWeightPattern = line
                                        stance = 'Orthodox'
                                    elif 'Right-handed' in line:
                                        stanceHeightReachWeightPattern = line      
                                        stance = 'Orthodox'
                                    elif 'Southpaw' in line:
                                        stanceHeightReachWeightPattern = line
                                        stance = 'Southpaw'
                                    elif 'LH' in line:
                                        stanceHeightReachWeightPattern = line
                                        stance = 'Southpaw'
                                #create variables for each specific column value
                                #identify which is which based on text pattern
                                #loop through all values
                                #i.e. if ' and " in stanceHeightReachWeightPattern[i] then this = height
                                #i.e. if lbs in stanceHeightReachWeightPattern[i] then this = career weight 
                                stanceHeightReachWeightPattern = re.sub(' ','',str(stanceHeightReachWeightPattern))
                                stanceHeightReachWeightPattern = re.sub('\.','',str(stanceHeightReachWeightPattern))
                                stanceHeightReachWeightPattern = stanceHeightReachWeightPattern.replace('’',"'").replace('”','"').replace('–','-').replace('¾','').replace('½','').replace('¼','').replace('1⁄2','').replace('1⁄4','').replace('3⁄4','').replace('1/2','').replace('3/4','').replace('1/4','')
                                stanceHeightReachWeightPattern = stanceHeightReachWeightPattern.replace('\\','')
                                stanceHeightReachWeightPattern = stanceHeightReachWeightPattern.split(';') 
                                print(stanceHeightReachWeightPattern)            
                                singleQuote = "'"
                                try:
                                    searchHeight = re.findall(r'\d+\\\'\d+"', str(stanceHeightReachWeightPattern))
                                    if not searchHeight:
                                        searchHeight = re.findall(r"\d+\'", str(stanceHeightReachWeightPattern))
                                        print(searchHeight)
                                    searchHeight = str(searchHeight[0])
                                    searchHeight = searchHeight.replace('\\','')        
                                except:
                                    print('no height')
                                try:
                                    searchWeightIndex = [i for i, s in enumerate(stanceHeightReachWeightPattern) if 'lbs' in s]
                                    searchWeight = stanceHeightReachWeightPattern[searchWeightIndex[0]]
                                except:
                                    print('no weight')
                                try:
                                    searchReachIndex = [i for i, s in enumerate(stanceHeightReachWeightPattern) if 'Reach' in s]               
                                    searchReach = stanceHeightReachWeightPattern[searchReachIndex[0]]
                                    searchReach = re.sub('Reach','',searchReach)
                                except:
                                    print('no reach')
                                   
                                #birthDate = re.sub(' ','', str(birthDate))
                                birthDate = re.sub('Born: ','', str(birthDate))
                                birthDate = birthDate.split(',')
                                print(birthDate) 
                                searchHeight = re.sub("'","''",str(searchHeight))
                                updateConn = pyodbc.connect('Driver={SQL Server};'
                                                      'Server=WINDOWS-25B0042\SQLEXPRESS,1433;'
                                                      'Database=autoboxing;'
                                                      'Trusted_Connection=yes;')                
                                updateCursor = updateConn.cursor()     
                                #write stats to db table - each stat is its own row
                                #write alias aliasquery
                                #write height
                                try:
                                    heightquery = 'Update BoxerData set Height = {2}{0}{2} where BoxerId = {1}'.format(searchHeight,boxerId,singleQuote)                      
                                    updateCursor.execute(heightquery)
                                    updateCursor.commit()
                                except:
                                    print('no height')
                                #write reach
                                try:  
                                    reachquery = 'Update BoxerData set Reach = {2}{0}{2} where BoxerId = {1}'.format(searchReach,boxerId,singleQuote)                                    
                                    updateCursor.execute(reachquery)   
                                    updateCursor.commit()
                                except:
                                    print('no reach')
                                #write division)   
                                try:    
                                    careerWeights = searchWeight.split('-')      
                                    lastspot = len(careerWeights)-1
                                    division = careerWeights[lastspot]
                                    division = re.sub(r'\D','', str(division))
                                    division = int(division)
                                    if division > 200:
                                        division = str(division)
                                        division = 'Heavyweight'
                                    elif 175 < division <=200:
                                        division = str(division)
                                        division = 'Cruiserweight'
                                    elif 168 < division <= 175:
                                        division = str(division)
                                        division = 'Light Heavyweight'
                                    elif 160 < division <= 168:
                                        division = str(division)
                                        division = 'Super Middleweight'
                                    elif 154 < division <= 160:
                                        division = str(division)
                                        division = 'Middleweight'
                                    elif 147 < division <= 154:
                                        division = str(division)
                                        division = 'Light Middleweight'
                                    elif 140 < division <= 147:
                                        division = str(division)
                                        division = 'Welterweight'
                                    elif 135 < division <= 140:
                                        division = str(division)
                                        division = 'Lightweight'
                                    elif 130 < division <= 135:
                                        division = str(division)
                                        division = 'Super Featherweight'
                                    elif 126 < division <= 130:
                                        division = str(division)
                                        division = 'Featherweight'
                                    elif 122 < division <= 126:
                                        division = str(division)
                                        division = 'Super Bantamweight'
                                    elif 118 < division <= 122:
                                        division = str(division)
                                        division = 'Bantamweight'
                                    elif 115 < division <= 118:
                                        division = str(division)
                                        division = 'Super Flyweight'
                                    elif 112 < division <= 115:
                                        division = str(division)
                                        division = 'Flyweight'
                                    elif 108 < division <= 112:
                                        division = str(division)
                                        division = 'Light Flyweight'
                                    elif 105 < division <= 108:
                                        division = str(division)
                                        division = 'Minimumweight'
                                    divisionquery = 'Update BoxerData set Division = {2}{0}{2} where BoxerId = {1}'.format(division,boxerId,singleQuote)    
                                    updateCursor.execute(divisionquery)    
                                    updateCursor.commit()
                                except:
                                    print('no division')
                                #write nationality
                               
                                try:    
                                    country = birthDate[1]#.encode(encoding='utf_16',errors='strict')
                                    country = str(country)
                                    country = country.lstrip()
                                    print(country)
                                    places = geograpy.get_place_context(text=country)
                                    nationalityquery  = 'Update BoxerData set Nationality = {2}{0}{2} where BoxerId = {1}'.format(places.countries[1],boxerId,singleQuote)
                                    updateCursor.execute(nationalityquery) 
                                    updateCursor.commit()
                                except:
                                    print('no nationality')
                                #write gender
                                #write stance
                                try:
                                    stancequery  = 'Update BoxerData set Stance = {2}{0}{2} where BoxerId = {1}'.format(stance,boxerId,singleQuote)
                                    updateCursor.execute(stancequery) 
                                    updateCursor.commit()
                                except:
                                    print('no stance')
                                #write birthdate
                                try:                                    
                                    dobquery  = 'Update BoxerData set dob = {2}{0}{2} where BoxerId = {1}'.format(birthDate[0],boxerId,singleQuote)
                                    updateCursor.execute(dobquery) 
                                    updateCursor.commit()
                                except:
                                    print('no dob')
                                #write weight
                                try:    
                                    careerweightquery  = 'Update BoxerData set careerweight = {2}{0}{2} where BoxerId = {1}'.format(searchWeight,boxerId,singleQuote)
                                    updateCursor.execute(careerweightquery) 
                                    updateCursor.commit()
                                except:
                                    print('no weight')
                                #close file
                                
                                updateCursor.close()
                                updateConn.close()            

        i=i+1
    idCount+=1
    pdfFileObj.close()  
    doc.close()      
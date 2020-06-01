# -*- coding: utf-8 -*-
"""
Created on Sun May 31 21:19:16 2020

@author: Sean
"""

import pyodbc 
conn = pyodbc.connect('Driver={SQL Server};'
                      'Server=WINDOWS-25B0042\SQLEXPRESS,1433;'
                      'Database=testdata;'
                      'Trusted_Connection=yes;')

cursor = conn.cursor()
#select every name from db
cursor.execute(str('select * from reversedOutput'))
singleQuote = "'"
duplicateidslist =[]
for row in cursor:
    duplicateidslist.append(row)
for duplicateid in duplicateidslist:
    boxerName = duplicateid[0]
    boxerId = duplicateid[1]
    newconn = pyodbc.connect('Driver={SQL Server};'
                          'Server=WINDOWS-25B0042\SQLEXPRESS,1433;'
                          'Database=autoboxing;'
                          'Trusted_Connection=yes;')
    
    newcursor = newconn.cursor()    
    addBoxerQuery = 'insert into BoxerData values ({1}, {2}{0}{2}, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)'.format(boxerName,boxerId,singleQuote)
    newcursor.execute(addBoxerQuery)
    newcursor.commit()  
    newcursor.close()
    newconn.close()  
cursor.close()
conn.close()    
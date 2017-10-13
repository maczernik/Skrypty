class CheckCollision():
    def __init__(self):
        
        self.posA =[[0,0],[0,0],[0,0],[0,0]]
        self.posB =[[0,0],[0,0],[0,0],[0,0]]
        self.dataA =[0,0,0,0,0]
        self.dataB =[0,0,0,0,0]
    def getData(self,deviceA,deviceB):
        message = ''
        try:
            if UdcObjectExt(deviceA).isRack() or UdcObjectExt(deviceA).isDevice():
                
                message += 'Rack:    '
                deviceLocation = UdcDeviceExt(UdcObjectExt(deviceA)).getLocation() 
                if deviceLocation != None:
                    posA = deviceLocation.getLevel()
                    self.dataA[0] = deviceLocation.getX()
                    self.dataA[1] = deviceLocation.getY()
                    self.dataA[2] = deviceLocation.getRotation()
                    self.dataA[3] = UdcRackExt(deviceA).getWidth()-1
                    self.dataA[4] = UdcRackExt(deviceA).getDepth()-1
                    
                if UdcObjectExt(deviceB).isRack() or UdcObjectExt(deviceB).isDevice():
                    message += 'Rack:    '
                    deviceLocation = UdcDeviceExt(UdcObjectExt(deviceB)).getLocation() 
                    if deviceLocation != None:
                        self.dataB[0] = deviceLocation.getX()
                        self.dataB[1] = deviceLocation.getY()
                        self.dataB[2] = deviceLocation.getRotation()
                        self.dataB[3] = UdcRackExt(deviceB).getWidth()-1
                        self.dataB[4] = UdcRackExt(deviceB).getDepth()-1
                        posB = deviceLocation.getLevel()
                    if(posA != posB):
                        return False
                    self.findCords()
                    return self.checkCollision()
        except AttributeError:
            pass    
    def findCords(self):
        x1tmp=self.dataA[0] 
        y1tmp=self.dataA[1] 
        x2tmp=self.dataA[0] + self.dataA[3]
        y2tmp=self.dataA[1] 
        x3tmp=self.dataA[0] + self.dataA[3]
        y3tmp=self.dataA[1] + self.dataA[4]
        x4tmp=self.dataA[0] 
        y4tmp=self.dataA[1] + self.dataA[4]
        bx = self.dataA[0] + (self.dataA[3]/2)
        by = self.dataA[1] + (self.dataA[4]/2)
        x1 = int(((x1tmp-bx)*math.cos(math.pi/180*self.dataA[2]) - (y1tmp-by)*math.sin(math.pi/180*self.dataA[2]) + bx))
        y1 = int(((x1tmp-bx)*math.sin(math.pi/180*self.dataA[2]) + (y1tmp-by)*math.cos(math.pi/180*self.dataA[2]) + by))
        x2 = int(((x2tmp-bx)*math.cos(math.pi/180*self.dataA[2]) - (y2tmp-by)*math.sin(math.pi/180*self.dataA[2]) + bx))
        y2 = int(((x2tmp-bx)*math.sin(math.pi/180*self.dataA[2]) + (y2tmp-by)*math.cos(math.pi/180*self.dataA[2]) + by))
        x3 = int(((x3tmp-bx)*math.cos(math.pi/180*self.dataA[2]) - (y3tmp-by)*math.sin(math.pi/180*self.dataA[2]) + bx))
        y3 = int(((x3tmp-bx)*math.sin(math.pi/180*self.dataA[2]) + (y3tmp-by)*math.cos(math.pi/180*self.dataA[2]) + by))
        x4 = int(((x4tmp-bx)*math.cos(math.pi/180*self.dataA[2]) - (y4tmp-by)*math.sin(math.pi/180*self.dataA[2]) + bx))
        y4 = int(((x4tmp-bx)*math.sin(math.pi/180*self.dataA[2]) + (y4tmp-by)*math.cos(math.pi/180*self.dataA[2]) + by))
        self.posA =[[x1,y1],[x2,y2],[x3,y3],[x4,y4]]
        x1tmp=self.dataB[0] 
        y1tmp=self.dataB[1] 
        x2tmp=self.dataB[0] + self.dataB[3]
        y2tmp=self.dataB[1] 
        x3tmp=self.dataB[0] + self.dataB[3]
        y3tmp=self.dataB[1] + self.dataB[4]
        x4tmp=self.dataB[0] 
        y4tmp=self.dataB[1] + self.dataB[4]
        bx = self.dataB[0] + (self.dataB[3]/2)
        by = self.dataB[1] + (self.dataB[4]/2)
        x1 = int(((x1tmp-bx)*math.cos(math.pi/180*self.dataB[2]) - (y1tmp-by)*math.sin(math.pi/180*self.dataB[2]) + bx))
        y1 = int(((x1tmp-bx)*math.sin(math.pi/180*self.dataB[2]) + (y1tmp-by)*math.cos(math.pi/180*self.dataB[2]) + by))
        x2 = int(((x2tmp-bx)*math.cos(math.pi/180*self.dataB[2]) - (y2tmp-by)*math.sin(math.pi/180*self.dataB[2]) + bx))
        y2 = int(((x2tmp-bx)*math.sin(math.pi/180*self.dataB[2]) + (y2tmp-by)*math.cos(math.pi/180*self.dataB[2]) + by))
        x3 = int(((x3tmp-bx)*math.cos(math.pi/180*self.dataB[2]) - (y3tmp-by)*math.sin(math.pi/180*self.dataB[2]) + bx))
        y3 = int(((x3tmp-bx)*math.sin(math.pi/180*self.dataB[2]) + (y3tmp-by)*math.cos(math.pi/180*self.dataB[2]) + by))
        x4 = int(((x4tmp-bx)*math.cos(math.pi/180*self.dataB[2]) - (y4tmp-by)*math.sin(math.pi/180*self.dataB[2]) + bx))
        y4 = int(((x4tmp-bx)*math.sin(math.pi/180*self.dataB[2]) + (y4tmp-by)*math.cos(math.pi/180*self.dataB[2]) + by))
        self.posB =[[x1,y1],[x2,y2],[x3,y3],[x4,y4]]
    def checkCollision(self):
        
        for P in self.posA:
            r = self.posB
            area = 0.5*abs( (r[0][1]-r[2][1])*(r[3][0]-r[1][0])+(r[1][1]-r[3][1])*(r[0][0]-r[2][0]))
            ABP = 0.5*abs((r[1][0]-r[0][0])*(P[1]-r[0][1])-(r[1][1]-r[0][1])*(P[0]-r[0][0]))
            BCP = 0.5*abs((r[2][0]-r[1][0])*(P[1]-r[1][1])-(r[2][1]-r[1][1])*(P[0]-r[1][0]))
            CDP = 0.5*abs((r[3][0]-r[2][0])*(P[1]-r[2][1])-(r[3][1]-r[2][1])*(P[0]-r[2][0]))
            DAP = 0.5*abs((r[0][0]-r[3][0])*(P[1]-r[3][1])-(r[0][1]-r[3][1])*(P[0]-r[3][0]))
            areaRectangle = (ABP+BCP+CDP+DAP)
            if areaRectangle == area:
                return True
        for P in self.posB:
            r = self.posA
            area = 0.5*abs( (r[0][1]-r[2][1])*(r[3][0]-r[1][0])+(r[1][1]-r[3][1])*(r[0][0]-r[2][0]))
            ABP = 0.5*abs((r[1][0]-r[0][0])*(P[1]-r[0][1])-(r[1][1]-r[0][1])*(P[0]-r[0][0]))
            BCP = 0.5*abs((r[2][0]-r[1][0])*(P[1]-r[1][1])-(r[2][1]-r[1][1])*(P[0]-r[1][0]))
            CDP = 0.5*abs((r[3][0]-r[2][0])*(P[1]-r[2][1])-(r[3][1]-r[2][1])*(P[0]-r[2][0]))
            DAP = 0.5*abs((r[0][0]-r[3][0])*(P[1]-r[3][1])-(r[0][1]-r[3][1])*(P[0]-r[3][0]))
            areaRectangle = (ABP+BCP+CDP+DAP)
            #area = self.dataA[3]*self.dataA[4]
            if areaRectangle == area: 
                return True
        return False
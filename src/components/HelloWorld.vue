<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <el-row>
      <el-col :span="6">
        <div style="width:100px;height:20px;"></div>
      </el-col>
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <el-input clearable v-model="searchKeyWork" @keyup.enter.native="search" placeholder="请输入内容"></el-input>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple-light">
          <el-button @click="search" type="primary">搜索字幕</el-button>
        </div>
      </el-col>
      <el-col :span="2">
        <div style="width:100px;height:20px;"></div>
      </el-col>
    </el-row>
    <br/>
    <hr />
    <el-container>
      <el-header>
        <div style="width:100%; height:20px;">
          <!-- {{command}} -->
          <el-input v-model="command"></el-input>
        </div> 
      </el-header>
      <el-main>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="id" width="80" label="序号"></el-table-column>
          <el-table-column label="字幕文件名称" prop="file_name" width="510">
            <!-- <template slot-scope="scope">
              {{splitFileName(scope.row)}}
            </template> -->
          </el-table-column>
          <el-table-column prop="content" label="字幕内容" width="470"></el-table-column>
          <el-table-column prop="start_at" label="字幕出现时间"  width="120"></el-table-column>
          <el-table-column prop="end_at" label="字幕结束时间"  width="120"></el-table-column>
          <el-table-column label="Operation" >
            <template slot-scope="scope">
              <el-button @click="generatCommand(scope.row)">
              <!-- ffmpeg  -i ./吸血鬼日记.The.Vampire.Diaries.S01E02.Chi_Eng.BDRip.AC3.1024X576.x264-YYeTs人人影视.mkv  -vcodec copy -acodec copy -ss 00:16:14 -to 00:16:17 ./result/output1.mkv -y -->
                生成ffmpeg命令
              </el-button>
            </template>
          </el-table-column>
       </el-table>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pagination.currentPage"
              :page-sizes="[10,20,50,100]"
              :page-size="pagination.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pagination.total">
            </el-pagination>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String,
  },
  data() {
    return {
      input: "",
      tableData: [],
      command: '',
      searchKeyWork:'',
      pagination: {
        pageSize: 10,
        currentPage: 1,
        total: ''
      }
    };
  },
  mounted() {
    //getMovies/5/10
    this.getMovies()
    // this.axios.get("/api/getMovies/5/10").then((res) => {
    //   console.log(res);
    // });
  },
  methods:{
    handleSecond(time, sign, second){
      let getSecondIndex = time.indexOf('.') - 2
      let getSecond = time.substring(getSecondIndex,2)
      let miao = Number(getSecond)
      if(sign === '-'){ // miao <= second 的情况 和 >= second的情况
        miao = miao - second > 0 ? miao - second : 0
      }else if(sign === '+'){
        miao = miao + second > 60 ? 59 : miao + second
      }
    },
    generatCommand(line){
      console.log(line)
      let start = line.startAt
      let end = line.endAt
      if(start.indexOf(',')>-1){
        start = start.replace(',','.')
      }
      // start = this.handleSecond(start, '-', 2)
      if(end.indexOf(',')>-1){
        end = end.replace(',','.')
      }
      // end = this.handleSecond(end, '+', 2)
      console.log(line)
      let num = Math.random() * 1000
      let filename = line.fileName.replace('.ass','').replace('.srt','')
      let saveto = `/e/dengqishun/cuts/${this.input}.${num}.mkv`
      this.command = `ffmpeg  -i ./${filename}  -vcodec copy -acodec copy -ss ${start} -to ${end} ${saveto} -y`
    },  
    splitFileName(fileName){
      // console.log(fileName.fileName.split('list')[1])
      return fileName.fileName.split('list')[1]
    },
    handleSizeChange(val){
      this.pagination.pageSize = val
      if(this.searchKeyWork === ''){
        this.getMovies()
      }else{
        this.search()
      }
    },
    handleCurrentChange(val){
      this.pagination.currentPage = val
      if(this.searchKeyWork === ''){
        this.getMovies()
      }else{
        this.search()
      }
    },
    getMovies(){
      this.axios.get(`/api/movie/index?page=${this.pagination.currentPage}&size=${this.pagination.pageSize}`).then(res=>{
          this.tableData = res.data.data.data
          this.pagination.pageSize = res.data.data.pageSize
          this.pagination.currentPage = res.data.data.currentPage
          this.pagination.total = res.data.data.count 
      })
      // {"start":0,"end":10,"totalRow":277667,"list":[{"id":1,"content":"早饭好了 快来吃饭 ","createdAt":null,"updatedAt":null,"startAt":"00:00:21,400","endAt":"00:00:23,880","fileName":"黄石.Yellowstone.S03E06.AMZN.WEB-DL.DDP2.0.H.264-NTb.简体&英文1.srt"},{"id":2,"content":"你姐姐呢  Where's your sister? ","createdAt":null,"updatedAt":null,"startAt":"00:00:30,990","endAt":"00:00:32,074","fileName":"黄石.Yellowstone.S03E06.AMZN.WEB-DL.DDP2.0.H.264-NTb.简体&英文1.srt"},{"id":3,"content":"Sila! ","createdAt":null,"updatedAt":null,"startAt":"00:00:37,000","endAt":"00:00:38,120","fileName":"黄石.Yellowstone.S03E06.AMZN.WEB-DL.DDP2.0.H.264-NTb.简体&英文1.srt"},{"id":4,"content":"Come on. ","createdAt":null,"updatedAt":null,"startAt":"00:00:38,720","endAt":"00:00:39,750","fileName":"黄石.Yellowstone.S03E06.AMZN.WEB-DL.DDP2.0.H.264-NTb.简体&英文1.srt"},{"id":5,"content":"这孩子...  That girl... ","createdAt":null,"updatedAt":null,"startAt":"00:00:42,460","endAt":"00:00:43,810","fileName":"黄石.Yellowstone.S03E06.AMZN.WEB-DL.DDP2.0.H.264-NTb.简体&英文1.srt"},{"id":6,"content":"Come on. ","createdAt":null,"updatedAt":null,"startAt":"00:00:47,940","endAt":"00:00:49,120","fileName":"黄石.Yellowstone.S03E06.AMZN.WEB-DL.DDP2.0.H.264-NTb.简体&英文1.srt"},{"id":7,"content":"Let's... ","createdAt":null,"updatedAt":null,"startAt":"00:00:51,802","endAt":"00:00:53,554","fileName":"黄石.Yellowstone.S03E06.AMZN.WEB-DL.DDP2.0.H.264-NTb.简体&英文1.srt"},{"id":8,"content":"嘿 克莉斯特尔  Hey, Crystal. ","createdAt":null,"updatedAt":null,"startAt":"00:01:02,400","endAt":"00:01:03,899","fileName":"黄石.Yellowstone.S03E06.AMZN.WEB-DL.DDP2.0.H.264-NTb.简体&英文1.srt"},{"id":9,"content":"茜拉昨晚没在你那里过夜吧  Sila didn't spend the night there last night, did she? ","createdAt":null,"updatedAt":null,"startAt":"00:01:03,900","endAt":"00:01:06,820","fileName":"黄石.Yellowstone.S03E06.AMZN.WEB-DL.DDP2.0.H.264-NTb.简体&英文1.srt"},{"id":10,"content":"没有吗  No? ","createdAt":null,"updatedAt":null,"startAt":"00:01:07,910","endAt":"00:01:09,069","fileName":"黄石.Yellowstone.S03E06.AMZN.WEB-DL.DDP2.0.H.264-NTb.简体&英文1.srt"}]}
    },
    search(){
      if(this.searchKeyWork === ''){
        this.getMovies()
        return false
      }
      // /movie/find?name=raise&page=3&size=50 /api/search?content=${this.searchKeyWork}
      this.axios.get(`/api/movie/find?name=${this.searchKeyWork}&page=${this.pagination.currentPage}&size=${this.pagination.pageSize}`).then(res=>{
          this.tableData = res.data.data.data
          this.pagination.pageSize = res.data.data.pageSize
          this.pagination.currentPage = res.data.data.currentPage
          this.pagination.total = res.data.data.count 
      })
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
